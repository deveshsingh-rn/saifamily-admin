import React from 'react';

export interface Column<Row extends object> {
  id: string;
  header: React.ReactNode;
  accessor?: keyof Row;
  cell?: (row: Row) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

interface TableProps<Row extends object> {
  columns: readonly Column<Row>[];
  data: readonly Row[];
  getRowKey: (row: Row) => React.Key;
  emptyMessage?: string;
  caption?: string;
}

function renderCellValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number'
  ) {
    return value;
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return String(value);
}

const Table = <Row extends object>({
  columns,
  data,
  getRowKey,
  emptyMessage = 'No records found.',
  caption,
}: TableProps<Row>) => {
  return (
    <div className="overflow-hidden border border-gray-200 bg-white shadow sm:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${column.headerClassName ?? ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={getRowKey(row)} className="hover:bg-gray-50">
                  {columns.map((column) => {
                    const content = column.cell
                      ? column.cell(row)
                      : renderCellValue(
                          column.accessor ? row[column.accessor] : undefined,
                        );

                    return (
                      <td
                        key={column.id}
                        className={`px-6 py-4 text-sm text-gray-900 ${column.cellClassName ?? ''}`}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
