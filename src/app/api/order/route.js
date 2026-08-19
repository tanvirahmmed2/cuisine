import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isLogin, isSales } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const auth = await isLogin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    if (!["admin", "manager", "sales"].includes(auth.payload.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 });
    }

    const { rows: orders } = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");

    if (orders.length > 0) {
      const orderIds = orders.map(o => o.id);
      const { rows: itemRows } = await pool.query("SELECT * FROM order_items WHERE order_id = ANY($1)", [orderIds]);
      const { rows: couponRows } = await pool.query("SELECT * FROM order_coupons WHERE order_id = ANY($1)", [orderIds]);
      
      orders.forEach(order => {
        order.items = itemRows.filter(item => item.order_id === order.id);
        const c = couponRows.find(c => c.order_id === order.id);
        order.coupon = c || null;
        order.coupon_code = c ? c.code : null;
        order.coupon_discount = c ? Number(c.discount_amount) : 0;
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
      paid_amount,
      change_amount,
      payment_method,
      table_id,
      table_no,
      note,
      status,
      transaction_id,
      coupon_id,
      coupon_code,
      coupon_discount,
    } = data;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
    }

    // Check if restaurant service is currently available
    const { rows: webRows } = await client.query("SELECT is_service_available FROM websites LIMIT 1");
    if (webRows.length > 0 && webRows[0].is_service_available === false) {
      return NextResponse.json({
        success: false,
        message: "Restaurant service is currently unavailable. We are not accepting orders at this time."
      }, { status: 400 });
    }

    const rawPhone = phone ? String(phone).trim() : "";
    const cleanedDigits = rawPhone.replace(/\D/g, "");
    let customerPhone = cleanedDigits.length >= 11 ? cleanedDigits.slice(-11) : rawPhone;
    let customerName = "guest";
    const isPhoneEmpty = !customerPhone || customerPhone === "" || customerPhone === "temp_guest";

    // Start transaction
    await client.query("BEGIN");
    await client.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS note TEXT;");
    await client.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS table_id INT;");
    await client.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS table_no VARCHAR(50);");

    if (isPhoneEmpty) {
      customerPhone = "temp_guest";
      customerName = "guest";
    } else {
      // 1. Check if user exists with the number in users (match last 11 digits)
      const { rows: existingUser } = await client.query(
        "SELECT name FROM users WHERE RIGHT(phone, 11) = $1 OR phone = $2 LIMIT 1", [customerPhone, rawPhone]);

      if (existingUser.length > 0) {
        customerName = existingUser[0].name;
        // Upsert customer record with user's name
        const { rows: cust } = await client.query("SELECT id FROM customers WHERE RIGHT(phone, 11) = $1 OR phone = $2 LIMIT 1", [customerPhone, rawPhone]);
        if (cust.length > 0) {
          await client.query("UPDATE customers SET name = $1, phone = $2 WHERE id = $3", [customerName, customerPhone, cust[0].id]);
        } else {
          await client.query("INSERT INTO customers (phone, name) VALUES ($1, $2)", [customerPhone, customerName]);
        }
      } else {
        // No registered user. Create or update customer record as guest
        customerName = "guest";
        const { rows: cust } = await client.query("SELECT id FROM customers WHERE RIGHT(phone, 11) = $1 OR phone = $2 LIMIT 1", [customerPhone, rawPhone]);
        if (cust.length > 0) {
          await client.query("UPDATE customers SET name = $1, phone = $2 WHERE id = $3", [customerName, customerPhone, cust[0].id]);
        } else {
          await client.query("INSERT INTO customers (phone, name) VALUES ($1, $2)", [customerPhone, customerName]);
        }
      }
    }

    const orderStatus = status || "pending";
    const determinedPaymentStatus = orderStatus === "pending" ? "unpaid" : "paid";

    // 2. Insert Order
    const { rows: orderRows } = await client.query(`INSERT INTO orders 
      (name, phone, delivery_method, table_id, table_no, note, sub_total, total_discount, total_price, paid_amount, change_amount, payment_method, status, transaction_id, payment_status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
      RETURNING id`, [
        customerName, 
        customerPhone, 
        delivery_method || "takein", 
        table_id || null, 
        table_no || null, 
        note || "", 
        sub_total || 0, 
        total_discount || 0, 
        total_price || 0, 
        paid_amount || 0, 
        change_amount || 0, 
        payment_method || "cash", 
        orderStatus, 
        transaction_id || "", 
        determinedPaymentStatus
      ]);

    const orderId = orderRows[0].id;

    if (table_id) {
      try {
        await client.query("INSERT INTO order_tables (order_id, table_id, table_no) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [orderId, table_id, table_no || '']);
        await client.query("UPDATE tables SET status = 'occupied', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [table_id]);
      } catch (tErr) {
        console.error("Failed to occupy table:", tErr.message);
      }
    }

    if (isPhoneEmpty) {
      customerPhone = orderId.toString();
      // Update order's phone with orderId
      await client.query("UPDATE orders SET phone = $1 WHERE id = $2", [customerPhone, orderId]);
      // Create guest customer record with phone set to orderId
      await client.query("INSERT INTO customers (phone, name) VALUES ($1, $2)", [customerPhone, "guest"]);
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

      const { rows: itemRows } = await client.query(`INSERT INTO order_items (order_id, product_id, title, quantity, price, discount) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`, [orderId, item.id || item._id, finalTitle, item.quantity, item.price, item.discount || 0, ]);

      const orderItemId = itemRows[0].id;

      // 4. Insert Order Item Variants (Snapshot)
      if (item.selectedVariants) {
        for (const variant of Object.values(item.selectedVariants)) {
          await client.query(`INSERT INTO order_item_variants (order_item_id, variant_id, name, value, price_adjustment) 
            VALUES ($1, $2, $3, $4, $5)`, [orderItemId, variant.id, variant.name, variant.value, variant.price_adjustment || 0]);
        }
      }
    }

    // 5. Connect coupon if applied
    if (coupon_code || coupon_id) {
      try {
        let finalCouponId = coupon_id || null;
        const finalCode = coupon_code ? String(coupon_code).trim().toUpperCase() : '';
        
        if (!finalCouponId && finalCode) {
          const { rows: cRows } = await client.query("SELECT id FROM coupons WHERE UPPER(code) = $1 LIMIT 1", [finalCode]);
          if (cRows.length > 0) {
            finalCouponId = cRows[0].id;
          }
        }

        await client.query(
          "INSERT INTO order_coupons (order_id, coupon_id, code, discount_amount) VALUES ($1, $2, $3, $4)",
          [orderId, finalCouponId, finalCode, Number(coupon_discount) || 0]
        );
      } catch (cErr) {
        console.error("Failed to connect order_coupons:", cErr.message);
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
      "SELECT id FROM orders WHERE id = $1 LIMIT 1", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    await pool.query("DELETE FROM orders WHERE id = $1", [id]);

    return NextResponse.json({ success: true, message: "Successfully deleted order" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    }, { status: 500 });
  }
}