'use client'
import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { MdSave } from 'react-icons/md'
import { Context } from '@/components/context/Context'
import { name, tagline } from '@/lib/database/secret'

const AdminSettings = () => {
    const { siteData, setSiteData, siteLoading } = useContext(Context);
    const [saving, setSaving] = useState(false);
    const [website, setWebsite] = useState({
        email: siteData?.email || '',
        phone: siteData?.phone || '',
        address: siteData?.address || '',
        sociallink: siteData?.sociallink || '',
    })

    useEffect(() => {
        if (!siteLoading && siteData) {
            setWebsite({
                email: siteData.email || '',
                phone: siteData.phone || '',
                address: siteData.address || '',
                sociallink: siteData.sociallink || '',
            })
        }
    }, [siteLoading, siteData])

    const handleChange = (e) => {
        const { name: fieldName, value } = e.target
        setWebsite(prev => ({ ...prev, [fieldName]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await axios.post('/api/website', website, { withCredentials: true })
            if (res.data.success) {
                toast.success('Settings updated successfully')
                setSiteData(res.data.payload)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update settings')
        } finally {
            setSaving(false)
        }
    }

    if (siteLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-tertiary-dark/10">
                <div>
                    <h1 className="text-2xl font-bold text-tertiary-dark">{name}</h1>
                    <p className="text-sm text-tertiary-dark/60 mt-1">{tagline}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Business Contact */}
                <div className="bg-tertiary-light border border-tertiary-dark/10 rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-tertiary-dark/10">
                        <h2 className="text-sm font-semibold text-tertiary-dark">Contact Information</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-tertiary-dark/80 mb-1">Support Email</label>
                            <input type="email" name="email" value={website.email || ''} onChange={handleChange} className="input-style" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-tertiary-dark/80 mb-1">Contact Phone</label>
                            <input name="phone" value={website.phone || ''} onChange={handleChange} className="input-style" />
                        </div>
                    </div>
                </div>

                {/* Location & Social */}
                <div className="bg-tertiary-light border border-tertiary-dark/10 rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-tertiary-dark/10">
                        <h2 className="text-sm font-semibold text-tertiary-dark">Location & Socials</h2>
                    </div>
                    <div className="p-6 flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-medium text-tertiary-dark/80 mb-1">Full Address</label>
                            <input name="address" value={website.address || ''} onChange={handleChange} className="input-style" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-tertiary-dark/80 mb-1">Primary Social URL</label>
                            <input name="sociallink" value={website.sociallink || ''} onChange={handleChange} className="input-style" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 pb-10">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-tertiary-light rounded-md text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-70 shadow-sm"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-tertiary-light/30 border-t-tertiary-light rounded-full animate-spin" />
                        ) : (
                            <MdSave size={18} />
                        )}
                        <span>Save Settings</span>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AdminSettings