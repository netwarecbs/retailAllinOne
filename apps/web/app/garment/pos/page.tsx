'use client'

import { Button, Card, CardContent, Input } from '@retail/ui'

export default function GarmentPOSPage() {
    return (
        <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0 space-y-4">
                {/* Title bar - compact */}
                <div className="bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded shadow-sm">{'<<'} POS</div>

                {/* Header form */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                            {/* Left column */}
                            <div className="md:col-span-7 grid grid-cols-12 gap-3">
                                <div className="col-span-6">
                                    <label className="block text-gray-600 mb-1">Name</label>
                                    <Input className="h-8" />
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-gray-600 mb-1">L.Card</label>
                                    <Input className="h-8" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-gray-600 mb-1">Invoice</label>
                                    <Input className="h-8 text-right" defaultValue={4} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-gray-600 mb-1">Date</label>
                                    <Input type="date" className="h-8" defaultValue="2025-08-11" />
                                </div>
                                <div className="col-span-6">
                                    <label className="block text-gray-600 mb-1">Mobile</label>
                                    <Input className="h-8" />
                                </div>
                                <div className="col-span-6">
                                    <label className="block text-gray-600 mb-1">GSTNo.</label>
                                    <Input className="h-8" />
                                </div>
                                <div className="col-span-12">
                                    <label className="block text-gray-600 mb-1">Address</label>
                                    <Input className="h-8" />
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">State</label>
                                    <select className="w-full border rounded px-2 py-1 h-8">
                                        <option>West Bengal (19)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Right info widgets */}
                            <div className="md:col-span-5 grid grid-cols-2 gap-2 items-start">
                                <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                    <div className="text-gray-500">Sold</div>
                                    <div className="text-gray-700 font-medium">Sold</div>
                                </div>
                                <div className="bg-gray-100 border rounded p-2 text-[10px]">
                                    <div className="text-gray-500">Recent</div>
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
                        </div>

                        {/* Quick entry row */}
                        <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-2 text-xs items-center">
                            <div className="lg:col-span-1 flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-5 h-5 border rounded">🏷️</span>
                                <span>Barcode</span>
                            </div>
                            <div className="lg:col-span-3"><Input className="h-8" placeholder="Barcode" /></div>
                            <div className="lg:col-span-4"><Input className="h-8" placeholder="Description" /></div>
                            <div className="lg:col-span-1"><Input className="h-8 text-right" placeholder="Qty" /></div>
                            <div className="lg:col-span-2"><Input className="h-8 text-right" placeholder="Sale Price" /></div>
                            <div className="lg:col-span-1"><Button className="h-8 bg-blue-600 hover:bg-blue-700 w-full">Enter</Button></div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main grid: left table, right tiles */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Left table */}
                    <Card className="border-0 shadow-sm lg:col-span-7">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                            <th className="px-3 py-2 text-left">#</th>
                                            <th className="px-3 py-2 text-left">DESCRIPTION</th>
                                            <th className="px-3 py-2 text-left">LOCATE</th>
                                            <th className="px-3 py-2 text-left">OFFERS</th>
                                            <th className="px-3 py-2 text-left">NET QTY</th>
                                            <th className="px-3 py-2 text-right">PRICE</th>
                                            <th className="px-3 py-2 text-right">DISC.</th>
                                            <th className="px-3 py-2 text-right">TOTAL VALUE</th>
                                            <th className="px-3 py-2 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { id: 1, desc: 'JAMA', locate: '', offers: '', qty: 1, price: 108, disc: 0, total: 108 },
                                            { id: 2, desc: 'JAMA', locate: '', offers: '', qty: 1, price: 108, disc: 0, total: 108 },
                                            { id: 3, desc: 'shirt', locate: '', offers: '', qty: 1, price: 7000, disc: 0, total: 7000 },
                                            { id: 4, desc: 'Pant RAYMOND', locate: 'PANDUA', offers: 'BULK\nDISC', qty: 1, price: 157.5, disc: 0, total: 157.5 },
                                            { id: 5, desc: 'Pant RAYMOND', locate: 'PANDUA', offers: 'BULK\nDISC', qty: 5, price: 157.5, disc: 0, total: 787.5 },
                                        ].map((row) => (
                                            <tr key={row.id} className="border-t">
                                                <td className="px-3 py-2">{row.id}</td>
                                                <td className="px-3 py-2">{row.desc}</td>
                                                <td className="px-3 py-2">{row.locate}</td>
                                                <td className="px-3 py-2">
                                                    {row.offers ? (
                                                        <div className="space-y-1">
                                                            {row.offers.split('\n').map((o) => (
                                                                <div key={o} className="bg-yellow-200 text-yellow-900 text-[10px] px-1">{o}</div>
                                                            ))}
                                                        </div>
                                                    ) : null}
                                                </td>
                                                <td className="px-3 py-2">{row.qty}</td>
                                                <td className="px-3 py-2 text-right">{row.price}</td>
                                                <td className="px-3 py-2 text-right">{row.disc}</td>
                                                <td className="px-3 py-2 text-right">{row.total}</td>
                                                <td className="px-3 py-2 text-right">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <Button variant="outline" className="h-6 px-2">✎</Button>
                                                        <Button variant="outline" className="h-6 px-2">🗑</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-3 py-2 text-[11px] text-gray-600 flex items-center gap-4">
                                <div>TOTAL 9</div>
                                <div className="ml-auto">8161</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right tiles area */}
                    <div className="lg:col-span-5 space-y-3">
                        <Card className="border-0 shadow-sm">
                            <CardContent className="p-2 text-xs">
                                <div className="bg-yellow-200 text-gray-800 inline-block px-2 py-1 rounded border border-yellow-300">General</div>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-sm">
                            <CardContent className="p-3">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { label: 'JAMA', price: 108, stock: -2 },
                                        { label: 'pant', price: 200, stock: -13 },
                                        { label: 'Pant', price: 157.5, stock: 9 },
                                        { label: 'shirt', price: 7000, stock: -3 },
                                    ].map((item) => (
                                        <div key={item.label} className="border rounded shadow-sm p-2">
                                            <div className="flex items-center justify-between text-[10px] font-semibold">
                                                <span>{item.price}</span>
                                                <span className={`${item.stock < 0 ? 'text-red-600' : 'text-green-600'}`}>{item.stock}</span>
                                            </div>
                                            <div className="mt-8 text-xs font-semibold">{item.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Bottom payment summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center text-xs">
                    <div className="lg:col-span-7 grid grid-cols-5 gap-2">
                        {[
                            { label: 'extra/Less', value: '' },
                            { label: 'Savings', value: '-675' },
                            { label: 'Invoice Total', value: '8161' },
                            { label: 'Cash', value: '8161' },
                            { label: 'Card', value: '0' },
                        ].map((f) => (
                            <div key={f.label} className="bg-yellow-100 border border-yellow-300 rounded p-2">
                                <div className="text-[10px] text-gray-700">{f.label}</div>
                                <Input className="h-7 text-right" defaultValue={f.value} />
                            </div>
                        ))}
                        <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                            <div className="text-[10px] text-gray-700">UPI</div>
                            <Input className="h-7 text-right" defaultValue={0} />
                        </div>
                        <div className="bg-yellow-100 border border-yellow-300 rounded p-2">
                            <div className="text-[10px] text-gray-700">Change Given</div>
                            <Input className="h-7 text-right" defaultValue={0} />
                        </div>
                    </div>
                    <div className="lg:col-span-5 flex flex-wrap items-center justify-end gap-3">
                        <Button className="h-8 bg-yellow-300 hover:bg-yellow-400 text-black text-xs px-4">Save</Button>
                        <Button className="h-8 bg-yellow-300 hover:bg-yellow-400 text-black text-xs px-4">Save & Print</Button>
                        <Button className="h-8 bg-yellow-300 hover:bg-yellow-400 text-black text-xs px-4">PDF</Button>
                        <Button className="h-8 bg-yellow-300 hover:bg-yellow-400 text-black text-xs px-4">Hold</Button>
                        <Button className="h-8 bg-yellow-300 hover:bg-yellow-400 text-black text-xs px-4">View(0)</Button>
                    </div>
                </div>
            </div>
        </main>
    )
}


