import React, { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { CustomerModal } from '@/components/customers/CustomerModal'
import { useCustomerStore } from '@/store/useCustomerStore'
import { useToastStore } from '@/store/useToastStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import type { Customer, CustomerFormData, CustomerStatus } from '@/types/customer'
import { formatCurrency, formatDate, exportToCSV } from '@/lib/utils'
import {
  Plus,
  ArrowUpDown,
  Download,
  Edit2,
  Trash2,
  Filter,
  Users,
  UserCheck,
  DollarSign,
  RotateCcw,
} from 'lucide-react'

export function CustomersPage() {
  const {
    customers,
    filters,
    setFilter,
    resetFilters,
    currentPage,
    setCurrentPage,
    pageSize,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getFilteredCustomers,
  } = useCustomerStore()

  const { success, info } = useToastStore()
  const { t } = useLanguageStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null)

  const filteredCustomers = getFilteredCustomers()
  const totalCustomers = filteredCustomers.length

  // Pagination slice
  const startIndex = (currentPage - 1) * pageSize
  const currentCustomers = filteredCustomers.slice(startIndex, startIndex + pageSize)

  const handleOpenAdd = () => {
    setEditingCustomer(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setIsModalOpen(true)
  }

  const handleFormSubmit = (data: CustomerFormData) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data)
      success('Customer updated', `Successfully updated profile for ${data.name}`)
    } else {
      addCustomer(data)
      success('Customer created', `Added new customer ${data.name}`)
    }
  }

  const handleConfirmDelete = () => {
    if (!deletingCustomerId) return
    const cust = customers.find((c) => c.id === deletingCustomerId)
    deleteCustomer(deletingCustomerId)
    setDeletingCustomerId(null)
    success('Customer deleted', `Removed record for ${cust?.name || 'customer'}`)
  }

  const handleExportCSV = () => {
    const exportData = filteredCustomers.map((c) => ({
      ID: c.id,
      Name: c.name,
      Email: c.email,
      Phone: c.phone,
      Status: c.status,
      TotalSpent: c.totalSpent,
      OrdersCount: c.ordersCount,
      JoinedDate: c.joinedDate,
      City: c.city,
      Country: c.country,
    }))
    exportToCSV('customers-directory', exportData)
    info('Exported customers directory to CSV')
  }

  // Summary Metrics
  const totalSpentSum = customers.reduce((acc, c) => acc + c.totalSpent, 0)
  const activeCount = customers.filter((c) => c.status === 'active').length

  const getStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="emerald" dot>{t.customers.statusActive}</Badge>
      case 'inactive':
        return <Badge variant="slate">{t.customers.statusInactive}</Badge>
      case 'blocked':
        return <Badge variant="rose" dot>{t.customers.statusBlocked}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.customers.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.customers.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4" />}
          >
            {t.common.export}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {t.customers.addCustomer}
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.customers.totalRegistered}</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{customers.length}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.customers.activeAccounts}</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{activeCount}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.customers.cumulativeRevenue}</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(totalSpentSum)}
            </h3>
          </div>
        </Card>
      </div>

      {/* Filter and Control Bar */}
      <Card noPadding className="p-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="w-full lg:w-72">
            <SearchInput
              value={filters.search}
              onChange={(val) => setFilter('search', val)}
              placeholder="Search by name, email, phone..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilter('status', e.target.value as CustomerStatus | 'all')
                }
                className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">{t.common.all} {t.common.status}</option>
                <option value="active">{t.customers.statusActive}</option>
                <option value="inactive">{t.customers.statusInactive}</option>
                <option value="blocked">{t.customers.statusBlocked}</option>
              </select>
            </div>

            {/* Sort Field */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilter(
                    'sortBy',
                    e.target.value as 'totalSpent' | 'ordersCount' | 'name' | 'joinedDate'
                  )
                }
                className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="totalSpent">{t.customers.totalSpent}</option>
                <option value="ordersCount">{t.customers.ordersCount}</option>
                <option value="name">{t.customers.fullName}</option>
                <option value="joinedDate">{t.customers.joinedDate}</option>
              </select>
            </div>

            {/* Direction */}
            <button
              onClick={() =>
                setFilter('sortDirection', filters.sortDirection === 'asc' ? 'desc' : 'asc')
              }
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors text-xs font-semibold"
              title={`Sort direction: ${filters.sortDirection.toUpperCase()}`}
            >
              {filters.sortDirection.toUpperCase()}
            </button>

            {/* Reset */}
            {(filters.search ||
              filters.status !== 'all' ||
              filters.sortBy !== 'totalSpent') && (
              <button
                onClick={resetFilters}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs inline-flex items-center gap-1"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.common.reset}</span>
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-5 sm:px-6">{t.dashboard.customer}</th>
                <th className="py-3 px-4">{t.customers.email} & {t.customers.phone}</th>
                <th className="py-3 px-4">{t.customers.location}</th>
                <th className="py-3 px-4">{t.customers.ordersCount}</th>
                <th className="py-3 px-4">{t.customers.totalSpent}</th>
                <th className="py-3 px-4">{t.common.status}</th>
                <th className="py-3 px-4">{t.customers.joinedDate}</th>
                <th className="py-3 px-5 text-right">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {currentCustomers.length > 0 ? (
                currentCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-5 sm:px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {cust.name}
                          </p>
                          <p className="text-[11px] text-slate-400">{cust.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-slate-700 dark:text-slate-200 font-medium">{cust.email}</p>
                      <p className="text-[11px] text-slate-400">{cust.phone}</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {cust.city}, {cust.country}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {cust.ordersCount} {t.orders.title.toLowerCase()}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(cust.totalSpent)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(cust.status)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                      {formatDate(cust.joinedDate)}
                    </td>

                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(cust)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit customer profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCustomerId(cust.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                    No customers match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4">
          <Pagination
            currentPage={currentPage}
            totalItems={totalCustomers}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </Card>

      {/* Customer Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        customer={editingCustomer}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingCustomerId}
        onClose={() => setDeletingCustomerId(null)}
        onConfirm={handleConfirmDelete}
        title={t.customers.deleteTitle}
        message={t.customers.deleteConfirm}
      />
    </div>
  )
}
