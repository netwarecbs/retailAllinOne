'use client'

import { Button, Card, CardContent } from '@retail/ui'

export default function GarmentSalesPage() {
    return (
        <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0 space-y-4">
                {/* Title bar - compact */}
                <div className="bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded shadow-sm">{'<<'} SALES</div>

                {/* Header form */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                            {/* Left column */}
                            <div className="md:col-span-6 grid grid-cols-12 gap-3">
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Type</label>
                                    <select className="w-full border rounded px-2 py-1">
                                        <option>Sales</option>
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
                                    <label className="block text-gray-600 mb-1">L.Card</label>
                                    <input className="w-full border rounded px-2 py-1" />
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">Invoice</label>
                                    <input type="date" className="w-full border rounded px-2 py-1" defaultValue="2025-08-11" />
                                </div>

                                <div className="col-span-4">
                                    <label className="block text-gray-600 mb-1">GSTNo.</label>
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

                                <div className="col-span-6">
                                    <label className="block text-gray-600 mb-1">State</label>
                                    <select className="w-full border rounded px-2 py-1">
                                        <option>West Bengal (19)</option>
                                    </select>
                                </div>
                                <div className="col-span-12">
                                    <label className="inline-flex items-center gap-2 mt-1"><input type="checkbox" /> Wholesale</label>
                                </div>
                            </div>
                        </div>

                        {/* Search / quick entry row */}
                        <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-2 text-xs items-center">
                            <div className="lg:col-span-1"><span className="text-[11px]">[#]</span></div>
                            <div className="lg:col-span-1 flex items-center gap-2">
                                <label className="inline-flex items-center gap-1"><input type="checkbox" /> List Up</label>
                                <span className="inline-flex items-center justify-center w-5 h-5 border rounded">🏷️</span>
                            </div>
                            <div className="lg:col-span-2"><input className="w-full border rounded px-2 py-1" placeholder="Barcode" /></div>
                            <div className="lg:col-span-3"><input className="w-full border rounded px-2 py-1" placeholder="Description" /></div>
                            <div className="lg:col-span-2"><select className="w-full border rounded px-2 py-1"><option>Select</option></select></div>
                            <div className="lg:col-span-1"><select className="w-full border rounded px-2 py-1"><option>PCS-PIE</option></select></div>
                            <div className="lg:col-span-1"><input className="w-full border rounded px-2 py-1 text-right" placeholder="Qty" /></div>
                            <div className="lg:col-span-1"><input className="w-full border rounded px-2 py-1 text-right" placeholder="Sale Price" /></div>
                            <div className="lg:col-span-1"><input className="w-full border rounded px-2 py-1" placeholder="HSN" /></div>
                            <div className="lg:col-span-1"><input className="w-full border rounded px-2 py-1 text-right" placeholder="GST%" /></div>
                            <div className="lg:col-span-1"><Button className="h-7 bg-blue-600 hover:bg-blue-700 w-full">Enter</Button></div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table + sidebar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-sm md:col-span-3">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                            <th className="px-3 py-2 text-left">#</th>
                                            <th className="px-3 py-2 text-left">DESCRIPTION</th>
                                            <th className="px-3 py-2 text-left">LOCATE</th>
                                            <th className="px-3 py-2 text-left">OFFERS</th>
                                            <th className="px-3 py-2 text-left">MRP</th>
                                            <th className="px-3 py-2 text-left">NET QTY</th>
                                            <th className="px-3 py-2 text-left">UNIT</th>
                                            <th className="px-3 py-2 text-right">PRICE</th>
                                            <th className="px-3 py-2 text-right">RATE</th>
                                            <th className="px-3 py-2 text-right">VALUE</th>
                                            <th className="px-3 py-2 text-right">DISC.</th>
                                            <th className="px-3 py-2 text-right">GST%</th>
                                            <th className="px-3 py-2 text-right">TOTAL VALUE</th>
                                            <th className="px-3 py-2 text-right"> </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="px-3 py-2">1</td>
                                            <td className="px-3 py-2">Pant RAYMOND</td>
                                            <td className="px-3 py-2">PANDUA</td>
                                            <td className="px-3 py-2">
                                                <div className="space-y-1">
                                                    <div className="bg-yellow-200 text-yellow-900 text-[10px] px-1">BULK</div>
                                                    <div className="bg-yellow-200 text-yellow-900 text-[10px] px-1">DISC</div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2">45</td>
                                            <td className="px-3 py-2">5</td>
                                            <td className="px-3 py-2">PCS-PIE</td>
                                            <td className="px-3 py-2 text-right">157.5</td>
                                            <td className="px-3 py-2 text-right">150</td>
                                            <td className="px-3 py-2 text-right">750</td>
                                            <td className="px-3 py-2 text-right">0</td>
                                            <td className="px-3 py-2 text-right">5</td>
                                            <td className="px-3 py-2 text-right">787.5</td>
                                            <td className="px-3 py-2 text-right">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Button variant="outline" className="h-6 px-2">✎</Button>
                                                    <Button variant="outline" className="h-6 px-2">🗑</Button>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr className="border-t">
                                            <td className="px-3 py-2">2</td>
                                            <td className="px-3 py-2">Pant RAYMOND</td>
                                            <td className="px-3 py-2">PANDUA</td>
                                            <td className="px-3 py-2">
                                                <div className="space-y-1">
                                                    <div className="bg-yellow-200 text-yellow-900 text-[10px] px-1">BULK</div>
                                                    <div className="bg-yellow-200 text-yellow-900 text-[10px] px-1">DISC</div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2">45</td>
                                            <td className="px-3 py-2">1</td>
                                            <td className="px-3 py-2">PCS-PIE</td>
                                            <td className="px-3 py-2 text-right">157.5</td>
                                            <td className="px-3 py-2 text-right">150</td>
                                            <td className="px-3 py-2 text-right">150</td>
                                            <td className="px-3 py-2 text-right">0</td>
                                            <td className="px-3 py-2 text-right">5</td>
                                            <td className="px-3 py-2 text-right">157.5</td>
                                            <td className="px-3 py-2 text-right">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Button variant="outline" className="h-6 px-2">✎</Button>
                                                    <Button variant="outline" className="h-6 px-2">🗑</Button>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr className="border-t">
                                            <td className="px-3 py-2">3</td>
                                            <td className="px-3 py-2">shirt</td>
                                            <td className="px-3 py-2"></td>
                                            <td className="px-3 py-2"></td>
                                            <td className="px-3 py-2">7000</td>
                                            <td className="px-3 py-2">1</td>
                                            <td className="px-3 py-2">PCS-PIE</td>
                                            <td className="px-3 py-2 text-right">7000</td>
                                            <td className="px-3 py-2 text-right">7000</td>
                                            <td className="px-3 py-2 text-right">7000</td>
                                            <td className="px-3 py-2 text-right">0</td>
                                            <td className="px-3 py-2 text-right">0</td>
                                            <td className="px-3 py-2 text-right">7000</td>
                                            <td className="px-3 py-2 text-right">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Button variant="outline" className="h-6 px-2">✎</Button>
                                                    <Button variant="outline" className="h-6 px-2">🗑</Button>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr className="border-t">
                                            <td className="px-3 py-2">4</td>
                                            <td className="px-3 py-2">JAMA</td>
                                            <td className="px-3 py-2"></td>
                                            <td className="px-3 py-2"></td>
                                            <td className="px-3 py-2">108</td>
                                            <td className="px-3 py-2">1</td>
                                            <td className="px-3 py-2">PCS-PIE</td>
                                            <td className="px-3 py-2 text-right">108</td>
                                            <td className="px-3 py-2 text-right">102.857</td>
                                            <td className="px-3 py-2 text-right">102.857</td>
                                            <td className="px-3 py-2 text-right">0</td>
                                            <td className="px-3 py-2 text-right">5</td>
                                            <td className="px-3 py-2 text-right">108</td>
                                            <td className="px-3 py-2 text-right">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Button variant="outline" className="h-6 px-2">✎</Button>
                                                    <Button variant="outline" className="h-6 px-2">🗑</Button>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr className="border-t">
                                            <td className="px-3 py-2">5</td>
                                            <td className="px-3 py-2">JAMA</td>
                                            <td className="px-3 py-2"></td>
                                            <td className="px-3 py-2"></td>
                                            <td className="px-3 py-2">108</td>
                                            <td className="px-3 py-2">1</td>
                                            <td className="px-3 py-2">PCS-PIE</td>
                                            <td className="px-3 py-2 text-right">108</td>
                                            <td className="px-3 py-2 text-right">102.857</td>
                                            <td className="px-3 py-2 text-right">102.857</td>
                                            <td className="px-3 py-2 text-right">0</td>
                                            <td className="px-3 py-2 text-right">5</td>
                                            <td className="px-3 py-2 text-right">108</td>
                                            <td className="px-3 py-2 text-right">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Button variant="outline" className="h-6 px-2">✎</Button>
                                                    <Button variant="outline" className="h-6 px-2">🗑</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-3 py-2 text-[11px] text-gray-600 flex items-center gap-4">
                                <div>TOTAL 7486</div>
                                <div className="ml-auto">9</div>
                            </div>
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
                                    <span>Savings :</span>
                                    <span className="font-medium text-gray-600">-675</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Invoice Total :</span>
                                    <span className="font-bold">8161</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 items-center">
                                    <span>Payment in Cash</span>
                                    <input className="border rounded px-2 py-1 text-right" defaultValue={8161} />
                                    <span>Payment in Card</span>
                                    <input className="border rounded px-2 py-1 text-right" defaultValue={0} />
                                    <span>Payment in UPI</span>
                                    <input className="border rounded px-2 py-1 text-right" defaultValue={0} />
                                    <span>Change Given</span>
                                    <input className="border rounded px-2 py-1 text-right" defaultValue={0} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom action buttons + hold */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center justify-center gap-3">
                        <Button className="h-8 bg-blue-600 hover:bg-blue-700 text-xs px-4">Save</Button>
                        <Button className="h-8 bg-blue-600 hover:bg-blue-700 text-xs px-4">Save & Print</Button>
                        <Button variant="outline" className="h-8 text-xs px-4">PDF</Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span>- -</span>
                        <Button variant="outline" className="h-8 text-xs px-4">Hold</Button>
                        <span>- -</span>
                        <Button variant="outline" className="h-8 text-xs px-4">View</Button>
                        <span>- on Hold(0)</span>
                    </div>
                </div>
            </div>
        </main>
    )
}


