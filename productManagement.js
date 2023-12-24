class ProducManagement {
  constructor() {
    this.autoIncrementId = 1;
    this.products = [];
  }

  getAllProducts() {
    console.log("Productos: ");
    this.products.forEach((product) => {
      console.log(product);
    });
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      throw new `Error el producto con el id ${id} no existe`();
    }

    console.log(product);
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    //Validacion de datos
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("Faltan datos para dar de alta al producto");
    }

    //Normalizacion de datos
    title = title.trim().toLowerCase();
    description = description.trim().toLowerCase();
    thumbnail = thumbnail.trim().toLowerCase();
    price = parseFloat(price);
    if (isNaN(price) || price <= 0) {
      throw new Error("El precio debe ser un numero positivo");
    }

    stock = parseInt(stock);
    if (isNaN(stock) || stock <= 0) {
      throw new Error("El stock debe ser un numero positivo");
    }
    //Validar que no se repita el code del producto.
    if (this.products.some((p) => p.code === code)) {
      throw new Error(`Ya existe un producto con el mismo code ${code}`);
    }
    if (this.products.some((p) => p.title === title)) {
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
  }

  removeProduct(product) {
    this.products = this.products.filter((p) => p.id !== product.id);
  }
}

//Prueba del las class ProducManagement
const product = new ProducManagement();

//Agregar productos
product.addProduct("producto prueba", "este es un producto de prueba", 200.00, "sin imagen", "abc123", 25);
product.addProduct("producto prueba 2", "este es un producto de prueba 2", 300.00, "sin imagen", "abc124", 25);

product.getAllProducts();
product.getProductById(1);