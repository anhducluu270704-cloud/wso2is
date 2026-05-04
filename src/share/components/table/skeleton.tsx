import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/share/ui/table'
import { Skeleton } from '@/share/ui/skeleton'

const SKELETON_COL_KEYS = [
  'col-a',
  'col-b',
  'col-c',
  'col-d',
  'col-e',
  'col-f',
  'col-g',
] as const

const SKELETON_ROW_KEYS = [
  'row-1',
  'row-2',
  'row-3',
  'row-4',
  'row-5',
  'row-6',
  'row-7',
  'row-8',
  'row-9',
  'row-10',
] as const

export default function TableSkeleton() {
  return (
    <div className="">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader>
              <TableRow>
                {SKELETON_COL_KEYS.map((colKey) => (
                  <TableHead key={colKey}>
                    <Skeleton className="h-4 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {SKELETON_ROW_KEYS.map((rowKey) => (
                <TableRow key={rowKey}>
                  {SKELETON_COL_KEYS.map((colKey) => (
                    <TableCell key={colKey}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
