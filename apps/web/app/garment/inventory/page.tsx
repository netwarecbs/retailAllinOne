'use client'

import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@retail/ui'

export default function GarmentInventoryPage() {
    return (
        <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0 space-y-4">
                {/* Title bar - compact */}
                <div className="bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded shadow-sm">{'<<'} Inventory</div>

                {/* Toolbar + Filters */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex flex-wrap items-center gap-2">
                                <Button variant="outline" className="h-7">Print Report</Button>
                                <Button variant="outline" className="h-7">Excel Report</Button>
                                <Button className="h-7 bg-blue-600 hover:bg-blue-700">Generate Barcode</Button>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button variant="outline" className="h-7">Brand</Button>
                                <Button variant="outline" className="h-7">Size</Button>
                                <Button variant="outline" className="h-7">Manage HSN</Button>
                                <Button variant="outline" className="h-7">Manage Units</Button>
                                <Button variant="outline" className="h-7">Categories</Button>
                                <Button className="h-7 bg-blue-600 hover:bg-blue-700">Add Item</Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 text-xs items-center">
                            <div className="md:col-span-3 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 font-medium">
                                    <span className="w-4 h-4 inline-flex items-center justify-center border rounded">🏷️</span>
                                </span>
                                <Input className="h-8" placeholder="Barcode/Serial" />
                            </div>
                            <div className="md:col-span-3">
                                <Input className="h-8" placeholder="Description Search" />
                            </div>
                            <div className="md:col-span-2">
                                <Input className="h-8" placeholder="Category" />
                            </div>
                            <div className="md:col-span-2">
                                <Input className="h-8" placeholder="Brand" />
                            </div>
                            <div className="md:col-span-1">
                                <Input className="h-8" placeholder="Size" />
                            </div>
                            <div className="md:col-span-1 flex items-center gap-2">
                                <span>Expiring in</span>
                                <Input className="h-8 w-16 text-right" defaultValue={0} />
                                <span>Days</span>
                            </div>
                            <div className="md:col-span-12 flex items-center gap-2">
                                <label className="flex items-center gap-2"><input type="checkbox" /> Low Stock</label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results table */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                        <th className="px-3 py-2 text-left">#</th>
                                        <th className="px-3 py-2 text-left">Description</th>
                                        <th className="px-3 py-2 text-left">Category</th>
                                        <th className="px-3 py-2 text-left">Brand</th>
                                        <th className="px-3 py-2 text-left">Location</th>
                                        <th className="px-3 py-2 text-left">Ageing</th>
                                        <th className="px-3 py-2 text-left">GST</th>
                                        <th className="px-3 py-2 text-left">Barcode</th>
                                        <th className="px-3 py-2 text-left">Qty.</th>
                                        <th className="px-3 py-2 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t">
                                        <td className="px-3 py-2">1)</td>
                                        <td className="px-3 py-2 font-semibold">JAMA</td>
                                        <td className="px-3 py-2">General</td>
                                        <td className="px-3 py-2"></td>
                                        <td className="px-3 py-2"></td>
                                        <td className="px-3 py-2">2 day</td>
                                        <td className="px-3 py-2">5%</td>
                                        <td className="px-3 py-2">12</td>
                                        <td className="px-3 py-2">-2 PCS</td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" className="h-6 px-2">✎</Button>
                                                <Button variant="outline" className="h-6 px-2">🗑</Button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="bg-blue-50 border-t">
                                        <td className="px-3 py-2">2)</td>
                                        <td className="px-3 py-2 font-semibold">Pant <span className="text-gray-500 italic">[bundle:3]</span></td>
                                        <td className="px-3 py-2">General</td>
                                        <td className="px-3 py-2">RAYMOND</td>
                                        <td className="px-3 py-2 flex items-center gap-2">
                                            <span className="inline-block bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full">SPECIAL OFFER</span>
                                            <span>PANDUA</span>
                                        </td>
                                        <td className="px-3 py-2">2 day</td>
                                        <td className="px-3 py-2">5%</td>
                                        <td className="px-3 py-2">1</td>
                                        <td className="px-3 py-2">9 PCS</td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" className="h-6 px-2">✎</Button>
                                                <Button variant="outline" className="h-6 px-2">🗑</Button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="border-t">
                                        <td className="px-3 py-2">3)</td>
                                        <td className="px-3 py-2 font-semibold">pant</td>
                                        <td className="px-3 py-2"></td>
                                        <td className="px-3 py-2"></td>
                                        <td className="px-3 py-2"></td>
                                        <td className="px-3 py-2">2 day</td>
                                        <td className="px-3 py-2">0%</td>
                                        <td className="px-3 py-2">555</td>
                                        <td className="px-3 py-2">-13 PCS</td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" className="h-6 px-2">✎</Button>
                                                <Button variant="outline" className="h-6 px-2">🗑</Button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="bg-blue-50 border-t">
                                        <td className="px-3 py-2">4)</td>
                                        <td className="px-3 py-2 font-semibold">shirt</td>
                                        <td className="px-3 py-2"></td>
                                        <td className="px-3 py-2"></td>
                                        <td className="px-3 py-2"></td>
                                        <td className="px-3 py-2">2 day</td>
                                        <td className="px-3 py-2">0%</td>
                                        <td className="px-3 py-2">12334</td>
                                        <td className="px-3 py-2">-3 PCS</td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" className="h-6 px-2">✎</Button>
                                                <Button variant="outline" className="h-6 px-2">🗑</Button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}


