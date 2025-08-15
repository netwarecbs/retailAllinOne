'use client'

import { Button, Card, CardContent, CardHeader, CardTitle } from '@retail/ui'
import { ActionGate } from '../../../components/RBAC'

export default function GarmentPurchasePage() {
    return (
        <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0 space-y-4">
                {/* Title bar - compact */}
                <div className="bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded shadow-sm">{'<<'} PURCHASE</div>

                {/* Header form */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                            {/* Left column */}
                            <div className="md:col-span-6 grid grid-cols-12 gap-3">
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Type</label>
                                    <select className="w-full border rounded px-2 py-1">
                                        <option>Purchase</option>
                                    </select>
                                </div>
                                <div className="col-span-8">
                                    <label className="block text-gray-600 mb-1">Name</label>
                                    <input className="w-full border rounded px-2 py-1" />
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Ref.</label>
                                    <input className="w-full border rounded px-2 py-1" />
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Mobile</label>
                                    <input className="w-full border rounded px-2 py-1" />
                                </div>
                                <div className="col-span-12">
                                    <label className="block text-gray-600 mb-1">Address</label>
                                    <input className="w-full border rounded px-2 py-1" />
                                </div>
                                <div className="col-span-12">
                                    <label className="block text-gray-600 mb-1">ShipTo</label>
                                    <input className="w-full border rounded px-2 py-1" />
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="md:col-span-6 grid grid-cols-12 gap-3">
                                <div className="col-span-12 grid grid-cols-3 gap-2">
                                    <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                        <div className="text-gray-500">Sold</div>
                                        <div className="text-gray-700 font-medium">Recent</div>
                                    </div>
                                    <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                        <div className="text-gray-500">loyalty</div>
                                        <div className="text-gray-700 font-medium">loyalty</div>
                                    </div>
                                    <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                        <div className="text-gray-500">Balance</div>
                                        <div className="text-gray-700 font-medium">Balance</div>
                                    </div>
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">L.Card</label>
                                    <input className="w-full border rounded px-2 py-1" />
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Invoice</label>
                                    <input type="date" className="w-full border rounded px-2 py-1" />
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">GST No.</label>
                                    <input className="w-full border rounded px-2 py-1" />
                                </div>
                                <div className="col-span-6">
                                    <label className="block text-gray-600 mb-1">State</label>
                                    <select className="w-full border rounded px-2 py-1">
                                        <option>West Bengal (19)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Search row */}
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                            <label className="inline-flex items-center gap-1"><input type="checkbox" /> List Up</label>
                            <span className="inline-flex items-center gap-1">
                                <span className="w-4 h-4 inline-flex items-center justify-center border rounded">🏷️</span>
                            </span>
                            <input className="border rounded px-2 py-1" placeholder="Barcode" />
                            <input className="border rounded px-2 py-1" placeholder="Brand" />
                            <input className="border rounded px-2 py-1 w-64" placeholder="Description" />
                        </div>
                    </CardContent>
                </Card>

                {/* Items grid + sidebar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-sm md:col-span-3">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                            <th className="px-3 py-2 text-left">#</th>
                                            <th className="px-3 py-2 text-left">Description</th>
                                            <th className="px-3 py-2 text-left">Category</th>
                                            <th className="px-3 py-2 text-left">Stock Type</th>
                                            <th className="px-3 py-2 text-left">Unit</th>
                                            <th className="px-3 py-2 text-right">Qty</th>
                                            <th className="px-3 py-2 text-right">Purch Rate</th>
                                            <th className="px-3 py-2 text-right">Profit%</th>
                                            <th className="px-3 py-2 text-right">HSN</th>
                                            <th className="px-3 py-2 text-right">GST%</th>
                                            <th className="px-3 py-2 text-right">Sale Price</th>
                                            <th className="px-3 py-2 text-right">MRP</th>
                                            <th className="px-3 py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="px-3 py-2">1</td>
                                            <td className="px-3 py-2">
                                                <input className="w-full border rounded px-2 py-1" placeholder="Pant RAYMOND" />
                                            </td>
                                            <td className="px-3 py-2">
                                                <select className="w-full border rounded px-2 py-1"><option>General</option></select>
                                            </td>
                                            <td className="px-3 py-2">
                                                <select className="w-full border rounded px-2 py-1"><option>General Goods</option></select>
                                            </td>
                                            <td className="px-3 py-2">
                                                <select className="w-full border rounded px-2 py-1"><option>PCS-PIE</option></select>
                                            </td>
                                            <td className="px-3 py-2 text-right"><input className="w-20 border rounded px-2 py-1 text-right" defaultValue={5} /></td>
                                            <td className="px-3 py-2 text-right"><input className="w-24 border rounded px-2 py-1 text-right" defaultValue={5.25} /></td>
                                            <td className="px-3 py-2 text-right"><input className="w-20 border rounded px-2 py-1 text-right" defaultValue={5} /></td>
                                            <td className="px-3 py-2 text-right"><input className="w-24 border rounded px-2 py-1 text-right" defaultValue={0} /></td>
                                            <td className="px-3 py-2 text-right"><input className="w-20 border rounded px-2 py-1 text-right" defaultValue={0} /></td>
                                            <td className="px-3 py-2 text-right"><input className="w-24 border rounded px-2 py-1 text-right" defaultValue={157.5} /></td>
                                            <td className="px-3 py-2 text-right"><input className="w-24 border rounded px-2 py-1 text-right" defaultValue={100} /></td>
                                            <td className="px-3 py-2 text-right"><Button className="bg-blue-600 hover:bg-blue-700 h-7 px-3 text-xs">Enter</Button></td>
                                        </tr>
                                        <tr className="border-t">
                                            <td className="px-3 py-2">2</td>
                                            <td className="px-3 py-2">
                                                <input className="w-full border rounded px-2 py-1" placeholder="shirt" />
                                            </td>
                                            <td className="px-3 py-2">
                                                <select className="w-full border rounded px-2 py-1"><option>General</option></select>
                                            </td>
                                            <td className="px-3 py-2">
                                                <select className="w-full border rounded px-2 py-1"><option>General Goods</option></select>
                                            </td>
                                            <td className="px-3 py-2">
                                                <select className="w-full border rounded px-2 py-1"><option>PCS-PIE</option></select>
                                            </td>
                                            <td className="px-3 py-2 text-right"><input className="w-20 border rounded px-2 py-1 text-right" defaultValue={0} /></td>
                                            <td className="px-3 py-2 text-right"><input className="w-24 border rounded px-2 py-1 text-right" defaultValue={0} /></td>
                                            <td className="px-3 py-2 text-right"><input className="w-20 border rounded px-2 py-1 text-right" defaultValue={0} /></td>
                                            <td className="px-3 py-2 text-right"><input className="w-24 border rounded px-2 py-1 text-right" defaultValue={0} /></td>
                                            <td className="px-3 py-2 text-right"><input className="w-20 border rounded px-2 py-1 text-right" defaultValue={0} /></td>
                                            <td className="px-3 py-2 text-right"><input className="w-24 border rounded px-2 py-1 text-right" defaultValue={7000} /></td>
                                            <td className="px-3 py-2 text-right"><input className="w-24 border rounded px-2 py-1 text-right" defaultValue={0} /></td>
                                            <td className="px-3 py-2 text-right"><Button className="bg-blue-600 hover:bg-blue-700 h-7 px-3 text-xs">Enter</Button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-3 py-2 text-[11px] text-gray-600">TOTAL 2</div>
                        </CardContent>
                    </Card>

                    {/* Sidebar */}
                    <Card className="border-0 shadow-sm md:col-span-1">
                        <CardContent className="p-3 space-y-3 text-xs">
                            <div className="flex items-center justify-between">
                                <span>Expense</span>
                                <select className="border rounded px-2 py-1">
                                    <option>Expense ▾</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span>Invoice Total :</span>
                                    <span className="font-bold">5</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 items-center">
                                    <span>Payment in Cash</span>
                                    <input className="border rounded px-2 py-1 text-right" defaultValue={5} />
                                    <span>Payment in Card</span>
                                    <input className="border rounded px-2 py-1 text-right" defaultValue={0} />
                                    <span>Payment in UPI</span>
                                    <input className="border rounded px-2 py-1 text-right" defaultValue={0} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom action buttons */}
                <div className="flex items-center justify-center gap-3">
                    <ActionGate tile="garment" page="purchase" action="save" fallback={null}>
                        <Button className="h-8 bg-blue-600 hover:bg-blue-700 text-xs px-4">Save</Button>
                    </ActionGate>
                    <ActionGate tile="garment" page="purchase" action="print" fallback={null}>
                        <Button className="h-8 bg-blue-600 hover:bg-blue-700 text-xs px-4">Save & Print</Button>
                    </ActionGate>
                    <ActionGate tile="garment" page="purchase" action="pdf" fallback={null}>
                        <Button variant="outline" className="h-8 text-xs px-4">PDF</Button>
                    </ActionGate>
                </div>
            </div>
        </main>
    )
}



