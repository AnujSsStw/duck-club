"use client"

import { Cross2Icon, MixerHorizontalIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



import { DataTableFacetedFilter } from "./DataTableFacetedFilter"
import { blinds } from "@/lib/constants"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    filterableColumns: {
        value: string
        label: string
    }[]
    selectedColumn: string
    setSelectedColumn: (value: string) => void
}

export function DataTableToolbar<TData>({
    table,
    filterableColumns,
    selectedColumn,
    setSelectedColumn,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center justify-between py-4">
            <div className="flex flex-1 items-center space-x-2">
                <Select onValueChange={setSelectedColumn} value={selectedColumn}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a column" />
                    </SelectTrigger>
                    <SelectContent>
                        {filterableColumns.map((column) => (
                            <SelectItem key={column.value} value={column.value}>
                                {column.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input
                    placeholder={`Filter ${selectedColumn}...`}
                    value={(table.getColumn(selectedColumn)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(selectedColumn)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm ml-4"
                    disabled={!selectedColumn}
                />
                {table.getColumn("blind") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("blind")}
                        title="Blind"
                        options={blinds.map((blind) => ({
                            label: blind.name,
                            value: blind.name,
                        }))}
                    />
                )}

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* visibility menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                        <MixerHorizontalIcon className="mr-2 h-4 w-4" />
                        View
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                        .getAllColumns()
                        .filter(
                            (column) => column.getCanHide() && column.id !== 'id'
                        )
                        .map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            )
                        })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}