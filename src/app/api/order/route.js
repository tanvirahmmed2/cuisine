import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isSales } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const auth = await isSales();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { rows: orders } = await pool.query("SELECT * FROM restaurant_orders ORDER BY created_at DESC");

    if (orders.length > 0) {
      const orderIds = orders.map(o => o.id);
      const { rows: itemRows } = await pool.query("SELECT * FROM restaurant_order_items WHERE order_id = ANY($1)", [orderIds]);
      
      orders.forEach(order => {
        order.items = itemRows.filter(item => item.order_id === order.id);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Successfully fetched orders",
      payload: orders,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    }, { status: 500 });
  }
}

export async function POST(req) {
  const client = await pool.connect();
  try {
    const data = await req.json();
    const {
      phone,
      delivery_method,
      items,
      sub_total,
      total_discount,
      total_price,
      payment_method,
      table_no,
      status,
      transaction_id,
    } = data;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
    }

    const trimmedPhone = phone ? phone.trim() : "";
    let customerPhone = trimmedPhone;
    let customerName = "guest";
    const isPhoneEmpty = trimmedPhone === "";

    // Start transaction
    await client.query("BEGIN");

    if (isPhoneEmpty) {
      customerPhone = "temp_guest";
      customerName = "guest";
    } else {
      // 1. Check if user exists with the number in restaurant_users
      const { rows: existingUser } = await client.query(
        "SELECT name FROM restaurant_users WHERE phone = $1 LIMIT 1", [customerPhone]);

      if (existingUser.length > 0) {
        customerName = existingUser[0].name;
        // Upsert customer record with user's name
        const { rows: cust } = await client.query("SELECT id FROM restaurant_customers WHERE phone = $1 LIMIT 1", [customerPhone]);
        if (cust.length > 0) {
          await client.query("UPDATE restaurant_customers SET name = $1 WHERE phone = $2", [customerName, customerPhone]);
        } else {
          await client.query("INSERT INTO restaurant_customers (phone, name) VALUES ($1, $2)", [customerPhone, customerName]);
        }
      } else {
        // No registered user. Create or update customer record as guest
        customerName = "guest";
        const { rows: cust } = await client.query("SELECT id FROM restaurant_customers WHERE phone = $1 LIMIT 1", [customerPhone]);
        if (cust.length > 0) {
          await client.query("UPDATE restaurant_customers SET name = $1 WHERE phone = $2", [customerName, customerPhone]);
        } else {
          await client.query("INSERT INTO restaurant_customers (phone, name) VALUES ($1, $2)", [customerPhone, customerName]);
        }
      }
    }

    const orderStatus = status || "pending";
    const determinedPaymentStatus = orderStatus === "pending" ? "unpaid" : "paid";

    // 2. Insert Order
    const { rows: orderRows } = await client.query(`INSERT INTO restaurant_orders 
      (name, phone, delivery_method, table_no, sub_total, total_discount, total_price, payment_method, status, transaction_id, payment_status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING id`, [customerName, customerPhone, delivery_method || "takein", table_no || "N/A", sub_total || 0, total_discount || 0, total_price || 0, payment_method || "cash", orderStatus, transaction_id || "", determinedPaymentStatus, ]);

    const orderId = orderRows[0].id;

    if (isPhoneEmpty) {
      customerPhone = orderId.toString();
      // Update order's phone with orderId
      await client.query("UPDATE restaurant_orders SET phone = $1 WHERE id = $2", [customerPhone, orderId]);
      // Create guest customer record with phone set to orderId
      await client.query("INSERT INTO restaurant_customers (phone, name) VALUES ($1, $2)", [customerPhone, "guest"]);
    }

    // 3. Insert Order Items
    for (const item of items) {
      let finalTitle = item.title;
      if (item.selectedVariants) {
        const variantNames = Object.values(item.selectedVariants).map(v => v.value).join(', ');
        if (variantNames) {
          finalTitle += ` (${variantNames})`;
        }
      }

      const { rows: itemRows } = await client.query(`INSERT INTO restaurant_order_items (order_id, product_id, title, quantity, price, discount) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`, [orderId, item.id || item._id, finalTitle, item.quantity, item.price, item.discount || 0, ]);

      const orderItemId = itemRows[0].id;

      // 4. Insert Order Item Variants (Snapshot)
      if (item.selectedVariants) {
        for (const variant of Object.values(item.selectedVariants)) {
          await client.query(`INSERT INTO restaurant_order_item_variants (order_item_id, variant_id, name, value, price_adjustment) 
            VALUES ($1, $2, $3, $4, $5)`, [orderItemId, variant.id, variant.name, variant.value, variant.price_adjustment || 0]);
        }
      }
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: `Order placed for ${customerName}`,
      orderId: orderId,
      customerName: customerName,
    }, { status: 201 });

  } catch (error) {
    await client.query("ROLLBACK");
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(req) {
  try {
    const auth = await isSales();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "Id not found" }, { status: 400 });
    }

    const { rows } = await pool.query(
      "SELECT id FROM restaurant_orders WHERE id = $1 LIMIT 1", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    await pool.query("DELETE FROM restaurant_orders WHERE id = $1", [id]);

    return NextResponse.json({ success: true, message: "Successfully deleted order" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    }, { status: 500 });
  }
}