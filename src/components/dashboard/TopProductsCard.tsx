import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Star, ChevronRight } from 'lucide-react'
import { useProductStore } from '@/store/useProductStore'
import { useLanguageStore } from '@/store/useLanguageStore'

export function TopProductsCard() {
  const { products } = useProductStore()
  const { t } = useLanguageStore()
  // Sort by sales count descending, take top 4
  const topProducts = [...products]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 4)

  return (
    <Card className="col-span-1">
      <CardHeader
        title={t.dashboard.topProducts}
        subtitle={t.dashboard.topProductsSubtitle}
        action={
          <Link
            to="/products"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 group"
          >
            {t.nav.allProducts}
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        }
      />

      <div className="space-y-4">
        {topProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200/60 dark:border-slate-800"
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400">{product.categoryName}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <div className="flex items-center text-amber-500 text-xs font-medium">
                    <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                    {product.rating}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {formatCurrency(product.price)}
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-[11px] text-slate-400">
                  {formatNumber(product.salesCount)} {t.common.sold}
                </span>
                {product.stock <= 10 && product.stock > 0 && (
                  <Badge variant="amber" className="text-[10px] px-1.5 py-0">
                    {t.products.lowStock}
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="rose" className="text-[10px] px-1.5 py-0">
                    {t.products.outOfStock}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
