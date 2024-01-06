const fs = require("fs").promises;

class ProductManagement {
  constructor() {
    this.autoIncrementId = 1;
    this.products = [];
    this.path = "productos.json";
  }

  async loadFromFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      console.error("Error al cargar desde el archivo:", error.message);
    }
  }

  async saveToFile() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
      console.log("Datos guardados en el archivo con éxito.");
    } catch (error) {
      console.error("Error al guardar en el archivo:", error.message);
    }
  }

  async getAllProducts() {
    try {
      // Cargar productos desde el archivo antes de mostrarlos
      await this.loadFromFile();

      console.log("Productos:");
      this.products.forEach((product) => {
        console.log(product);
      });
    } catch (error) {
      console.error("Error al obtener todos los productos:", error.message);
    }
  }

  async getProductById(id) {
    try {
      // Cargar productos desde el archivo antes de buscar por ID
      await this.loadFromFile();

      const product = this.products.find((product) => product.id === id);

      if (!product) {
        console.error(`Error: el producto con el id ${id} no existe.`);
        return;
      }

      console.log(product);
    } catch (error) {
      console.error(
        `Error al obtener el producto con ID ${id}:`,
        error.message
      );
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    await this.loadFromFile();
    //Validacion de datos
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("Faltan datos para dar de alta al producto");
    }

    //Normalizacion de datos
    title = title.trim().toLowerCase();
    description = description.trim().toLowerCase();
    thumbnail = thumbnail.trim().toLowerCase();
    code = code.trim().toLowerCase();
    price = parseFloat(price);
    if (isNaN(price) || price <= 0) {
      throw new Error("El precio debe ser un numero positivo");
    }
    stock = parseInt(stock);
    if (isNaN(stock) || stock <= 0) {
      throw new Error("El stock debe ser un numero positivo");
    }

    //Validar que no se repita el code del producto.
    if (this.products.some((p) => p.title.trim().toLowerCase() === title)) {
      throw new Error(`Ya existe un producto con el mismo título ${title}`);
    }
    if (this.products.some((p) => p.code === code)) {
      throw new Error(`Ya existe un producto con el mismo title ${title}`);
    }

    const product = {
      id: this.autoIncrementId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(product);
    console.log(`Producto ${title} agregado con exito`);
    this.saveToFile();
  }

  async updateProduct(id, updatedProduct) {
    console.log("Actualizando producto con id", id);
    await this.loadFromFile();
    // Buscar el producto por ID y obtener su índice en el arreglo
    const index = this.products.findIndex((product) => product.id === id);
    console.log(index);

    if (index === -1) {
      console.error(`Error: el producto con el id ${id} no existe.`);
      return;
    }

    // Copiar el producto existente para no modificar el objeto original
    const existingProduct = { ...this.products[index] };

    // Actualizar solo los campos proporcionados en updatedProduct
    for (const key in updatedProduct) {
      if (Object.prototype.hasOwnProperty.call(updatedProduct, key)) {
        existingProduct[key] = updatedProduct[key];
      }
    }

    // Normalizar y validar los datos actualizados
    const { title, description, price, thumbnail, code, stock } =
      existingProduct;

    // ... (Resto de las validaciones)

    // Actualizar el producto en el arreglo
    this.products[index] = existingProduct;

    // Guardar productos en el archivo después de actualizar
    await this.saveToFile();

    console.log(`Producto con id ${id} actualizado con éxito.`);
  }

  async deleteProduct(id) {
    try {
      await this.loadFromFile();
      this.products = this.products.filter((p) => p.id !== id);
      await this.saveToFile();
      console.log(`Producto con id ${id} eliminado con éxito.`);
    } catch (error) {
      console.error(
        `Error al eliminar el producto con ID ${id}:`,
        error.message
      );
    }
  }
}

// Prueba de la clase ProductManagement
const productManager = new ProductManagement("productos.json");

// Cargar productos desde el archivo (si existe)
//productManager.loadFromFile();

//Agregar productos
productManager.addProduct(
  "Producto de prueba",
  "Este es un producto de prueba",
  200.0,
  "sin imagen",
  "abc123",
  25
);
productManager.addProduct(
  "Producto de prueba 2",
  "Este es un producto de prueba 2",
  300.0,
  "sin imagen",
  "abc124",
  25
);

//productManager.getAllProducts();
//productManager.getProductById(1);

// Actualizar producto
// productManager.updateProduct(1, {
//   code: "eeee",
//   stock: 50
// });

// Eliminar producto
//productManager.deleteProduct(2);

// Mostrar productos después de actualizar y eliminar
//productManager.getAllProducts();
