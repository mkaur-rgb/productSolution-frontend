import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product as ApiProduct } from '../product.service';

// Local interface for frontend-only mode (non-API)
interface LocalProduct {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  // API-backed mode (live backend)
  products: ApiProduct[] = [];
  newProduct: ApiProduct = { id: 0, name: '', price: 0 };
  editProductId: number | null = null;
  editedProduct: ApiProduct = { id: 0, name: '', price: 0 };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Error fetching products', err),
    });
  }

  addProduct() {
    if (!this.newProduct.name.trim() || this.newProduct.price <= 0) {
      alert('Enter valid name and price');
      return;
    }
    this.productService.addProduct(this.newProduct).subscribe({
      next: (createdProduct) => {
        this.products.push(createdProduct);
        this.newProduct = { id: 0, name: '', price: 0 };
      },
      error: (err) => console.error('Error adding product', err),
    });
  }

  startEdit(product: ApiProduct) {
    this.editProductId = product.id;
    this.editedProduct = { ...product };
  }

  saveEdit() {
    if (!this.editedProduct.name.trim() || this.editedProduct.price <= 0) {
      alert('Enter valid name and price');
      return;
    }
    this.productService.updateProduct(this.editedProduct).subscribe({
      next: () => {
        this.products = this.products.map((p) =>
          p.id === this.editedProduct.id ? { ...this.editedProduct } : p
        );
        this.cancelEdit();
      },
      error: (err) => console.error('Error updating product', err),
    });
  }

  cancelEdit() {
    this.editProductId = null;
    this.editedProduct = { id: 0, name: '', price: 0 };
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p.id !== id);
      },
      error: (err) => console.error('Error deleting product', err),
    });
  }

  // ======================
  // Frontend-only mode (no backend, dummy data)
  /*
  localProducts: LocalProduct[] = [
    { id: 1, name: 'Smartphone', price: 699 },
    { id: 2, name: 'Laptop', price: 999 },
    { id: 3, name: 'Headphones', price: 199 },
  ];

  localNewProduct: LocalProduct = { id: 0, name: '', price: 0 };
  localEditedProduct: LocalProduct = { id: 0, name: '', price: 0 };
  localEditProductId: number | null = null;

  localAddProduct() {
    if (!this.localNewProduct.name.trim() || this.localNewProduct.price <= 0) {
      alert('Enter valid name and price');
      return;
    }
    this.localNewProduct.id =
      this.localProducts.length > 0
        ? Math.max(...this.localProducts.map((p) => p.id)) + 1
        : 1;
    this.localProducts.push({ ...this.localNewProduct });
    this.localNewProduct = { id: 0, name: '', price: 0 };
  }

  localStartEdit(product: LocalProduct) {
    this.localEditProductId = product.id;
    this.localEditedProduct = { ...product };
  }

  localSaveEdit() {
    if (!this.localEditedProduct.name.trim() || this.localEditedProduct.price <= 0) {
      alert('Enter valid name and price');
      return;
    }
    this.localProducts = this.localProducts.map((p) =>
      p.id === this.localEditedProduct.id ? { ...this.localEditedProduct } : p
    );
    this.localCancelEdit();
  }

  localCancelEdit() {
    this.localEditProductId = null;
    this.localEditedProduct = { id: 0, name: '', price: 0 };
  }

  localDeleteProduct(id: number) {
    this.localProducts = this.localProducts.filter((p) => p.id !== id);
  }
  */
}
