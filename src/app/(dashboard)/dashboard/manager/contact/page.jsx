import DeleteContact from '@/components/buttons/DeleteContact'
import { getBaseUrl } from '@/lib/helper';
import Link from 'next/link'
import React from 'react'
import { MdMail, MdInbox } from 'react-icons/md'

const Contact = async () => {
  const baseUrl = await getBaseUrl()
  const res = await fetch(`${baseUrl}/api/contact`, { method: 'GET', cache: 'no-store' })
  const data = await res.json()

  const supports = data.success ? data.payload : []

  return (
    <div className='w-full max-w-5xl mx-auto flex flex-col gap-8'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>Contact Inbox</h1>
          <p className='text-gray-500 text-sm'>Customer messages and enquiries.</p>
        </div>
        {supports.length > 0 && (
          <div className='bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider'>
            {supports.length} Messages
          </div>
        )}
      </div>

      <div className='flex flex-col gap-3'>
        {supports.length > 0 ? (
          supports.map((info) => (
            <div key={info.id} className='w-full bg-white border border-gray-100 rounded-xl p-5 hover:border-pink-500 transition-all flex flex-col md:flex-row gap-4 items-start'>

              {/* Left: Sender Info */}
              <div className='flex items-start gap-3 md:w-56 shrink-0'>
                <div className='w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 shrink-0'>
                  <MdMail size={20} />
                </div>
                <div className='min-w-0'>
                  <h3 className='font-semibold text-gray-800 text-sm truncate'>{info.name}</h3>
                  <p className='text-[10px] text-gray-400 font-medium truncate'>{info.email}</p>
                </div>
              </div>

              {/* Middle: Message */}
              <div className='flex-1 min-w-0 space-y-1'>
                <p className='text-xs font-bold text-gray-500 uppercase tracking-widest'>Subject</p>
                <p className='text-sm font-semibold text-gray-700 truncate'>{info.subject}</p>
                <div
                  className='text-xs text-gray-500 leading-relaxed line-clamp-2 prose prose-sm max-w-none'
                  dangerouslySetInnerHTML={{ __html: info.message }}
                />
              </div>

              {/* Right: Actions */}
              <div className='flex items-center gap-2 shrink-0'>
                <Link
                  href={`mailto:${info.email}`}
                  className='px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-pink-500 transition-all'
                >
                  Reply
                </Link>
                <DeleteContact id={info.id} />
              </div>
            </div>
          ))
        ) : (
          <div className='py-24 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center gap-3'>
            <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-300'>
              <MdInbox size={28} />
            </div>
            <div className='text-center'>
              <p className='text-gray-700 font-semibold text-sm'>No messages yet</p>
              <p className='text-gray-400 text-xs mt-0.5'>New contact messages will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Contact