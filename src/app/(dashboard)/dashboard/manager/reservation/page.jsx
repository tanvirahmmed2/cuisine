
import ConfirmBooking from '@/components/buttons/ConfirmBooking'
import DeleteReservation from '@/components/buttons/DeleteReservation'
import { getBaseUrl } from '@/lib/helper';
import Link from 'next/link'
import React from 'react'

const Reservation = async () => {
  let reservations = []
  try {
    const baseUrl = await getBaseUrl()
    const res = await fetch(`${baseUrl}/api/reservation`, { method: 'GET', cache: 'no-store' })
    const data = await res.json()
    if (data.success) reservations = data.payload
  } catch (error) {
    console.error("Failed to fetch reservations:", error)
  }

  return (
    <div className='w-full max-w-6xl mx-auto flex flex-col gap-8'>
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>Reservation Inbox</h1>
          <p className='text-gray-500 text-sm'>Manage customer bookings and table assignments.</p>
        </div>
        <div className="bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
          {reservations.length} Active Bookings
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        {reservations.map((info) => (
          <div key={info.id} className='w-full grid grid-cols-12 p-5 bg-white border border-gray-100 rounded-xl hover:border-pink-500 transition-all items-start gap-4'>
            <div className='col-span-4 flex flex-col gap-1'>
              <h3 className='text-base font-semibold text-gray-800'>{info.name}</h3>
              <p className='text-xs text-gray-400 font-medium'>{info.email}</p>
              <div className='mt-2 flex items-center gap-2'>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                  info.status === 'pending' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {info.status}
                </span>
              </div>
            </div>

            <div className='col-span-5 flex flex-col gap-2'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-widest'>Date</p>
                  <p className='text-sm text-gray-700 font-medium'>{new Date(info.res_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-widest'>Table & Size</p>
                  <p className='text-sm text-gray-700 font-medium'>Table {info.table_no} • {info.member_count} Pax</p>
                </div>
              </div>
              {info.message && (
                <div className='mt-1'>
                  <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-widest'>Customer Note</p>
                  <p className='text-xs text-gray-500 leading-relaxed'>"{info.message}"</p>
                </div>
              )}
            </div>

            <div className='col-span-3 flex flex-col gap-2 items-end justify-center h-full'>
              <Link 
                href={`mailto:${info.email}`} 
                className="w-full max-w-[120px] bg-gray-50 text-gray-900 py-2 rounded-lg text-center text-xs font-semibold hover:bg-pink-500 hover:text-white transition-all"
              >
                Reply
              </Link>
              <div className='w-full max-w-[120px] flex items-center gap-2'>
                <ConfirmBooking id={info.id}/>
                <DeleteReservation id={info.id} />
              </div>
            </div>
          </div>
        ))}
        {reservations.length === 0 && (
          <div className='text-center py-24 bg-gray-50/50 rounded-xl border border-dashed border-gray-200'>
            <p className='text-gray-400 text-sm font-medium'>No reservations found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reservation