import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockEntryComponent } from './stock-entry/stock-entry.component';
import { InventoryComponent } from './inventory.component';
import { CategoriesComponent } from './categories/categories.component';
import { InventoryHomeComponent } from './inventory-home/inventory-home.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    children: [
      { path: '', redirectTo: '/inventory/home', pathMatch: 'full' },
      { path: 'home', component: InventoryHomeComponent },
      { path: 'stock-entry', component: StockEntryComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'categories', component: CategoriesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
