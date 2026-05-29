import type { ReactNode } from 'react'

export interface SupportTableColumn<T> {
  key: string
  header: string
  className?: string
  render: (row: T) => ReactNode
}

interface Props<T> {
  columns: Array<SupportTableColumn<T>>
  rows: T[]
  getRowKey: (row: T) => string
}

export default function SupportTable<T>({ columns, rows, getRowKey }: Props<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="sheet">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
                  <div className="px-3 py-3">{column.render(row)}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
