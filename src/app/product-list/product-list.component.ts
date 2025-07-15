import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  products: Product[] = [
    { id: 1, name: 'Smartphone', price: 699 },
    { id: 2, name: 'Laptop', price: 999 },
    { id: 3, name: 'Headphones', price: 199 },
  ];

  newProduct: Product = { id: 0, name: '', price: 0 };
  editProductId: number | null = null; // Tracking editing state
  editedProduct: Product = { id: 0, name: '', price: 0 };

  addProduct() {
    if (!this.newProduct.name.trim() || this.newProduct.price <= 0) {
      alert('Enter valid name and price');
      return;
    }
    this.newProduct.id =
      this.products.length > 0
        ? Math.max(...this.products.map((p) => p.id)) + 1
        : 1;
    this.products.push({ ...this.newProduct });
    this.newProduct = { id: 0, name: '', price: 0 };
  }
  // UPDATE
  startEdit(product: Product) {
    this.editProductId = product.id;
    this.editedProduct = { ...product }; // Cloning product
  }

  saveEdit() {
    if (!this.editedProduct.name.trim() || this.editedProduct.price <= 0) {
      alert('Enter valid name and price');
      return;
    }
    this.products = this.products.map((p) =>
      p.id === this.editedProduct.id ? { ...this.editedProduct } : p
    );
    this.cancelEdit();
  }

  cancelEdit() {
    this.editProductId = null;
    this.editedProduct = { id: 0, name: '', price: 0 };
  }

  deleteProduct(id: number) {
    this.products = this.products.filter((p) => p.id !== id);
  }
}
