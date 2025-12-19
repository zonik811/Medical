import { driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

export const productsTour: DriveStep[] = [
    {
        element: "#create-product-btn",
        popover: {
            title: "➕ Crear Nuevo Producto",
            description: "Haz clic aquí para agregar un nuevo producto a tu catálogo. Podrás configurar nombre, precio, descripción, imágenes y más.",
            side: "bottom",
            align: "start"
        }
    },
    {
        element: "#products-grid",
        popover: {
            title: "📦 Lista de Productos",
            description: "Aquí aparecen todos tus productos. Puedes ver la información básica de cada uno en las tarjetas.",
            side: "top",
            align: "center"
        }
    },
    {
        element: "[data-tour='product-card']",
        popover: {
            title: "🏷️ Tarjeta de Producto",
            description: "Cada tarjeta muestra la imagen, nombre, precio y stock del producto. Desde aquí puedes editar o eliminar.",
            side: "right",
            align: "start"
        }
    },
    {
        element: "[data-tour='edit-product']",
        popover: {
            title: "✏️ Editar Producto",
            description: "Usa este botón para modificar cualquier información del producto: precio, stock, descripción, imágenes, etc.",
            side: "left",
            align: "center"
        }
    },
    {
        element: "[data-tour='product-stock']",
        popover: {
            title: "📊 Stock Disponible",
            description: "Aquí se muestra el stock actual del producto. Si está en 0, aparecerá como 'Agotado'.",
            side: "bottom",
            align: "center"
        }
    },
    {
        element: "[data-tour='manage-stock']",
        popover: {
            title: "📦 Gestionar Stock",
            description: "Usa este botón morado para abrir el modal y cambiar el stock del producto. Puedes sumar o restar unidades fácilmente.",
            side: "left",
            align: "center"
        }
    },
    {
        element: "[data-tour='edit-product']",
        popover: {
            title: "✏️ Editar Producto",
            description: "Usa este botón azul para modificar cualquier información del producto: precio, descripción, imágenes, categoría, etc.",
            side: "left",
            align: "center"
        }
    },
    {
        element: "[data-tour='delete-product']",
        popover: {
            title: "🗑️ Eliminar Producto",
            description: "Este botón rojo elimina el producto permanentemente. Te pedirá confirmación antes de borrarlo.",
            side: "left",
            align: "center"
        }
    }
];

export const createProductTour: DriveStep[] = [
    {
        element: "[data-tour='product-name']",
        popover: {
            title: "📝 Nombre del Producto",
            description: "Ingresa el nombre del producto que quieres vender. Ejemplo: 'Hamburguesa Clásica', 'Camisa Azul', etc.",
            side: "right",
            align: "start"
        }
    },
    {
        element: "[data-tour='product-description']",
        popover: {
            title: "📄 Descripción",
            description: "Describe el producto: ingredientes, materiales, características especiales. Esto ayuda a los clientes a conocer mejor el producto.",
            side: "right",
            align: "start"
        }
    },
    {
        element: "[data-tour='product-price']",
        popover: {
            title: "💰 Precio",
            description: "Define el precio de venta del producto. Solo números, el símbolo $ se agrega automáticamente.",
            side: "left",
            align: "start"
        }
    },
    {
        element: "[data-tour='product-category']",
        popover: {
            title: "🏷️ Categoría",
            description: "Selecciona una categoría existente o crea una nueva con el botón +. Las categorías ayudan a organizar tus productos.",
            side: "left",
            align: "start"
        }
    },
    {
        element: "[data-tour='category-create']",
        popover: {
            title: "➕ Crear Categoría Nueva",
            description: "Si no encuentras la categoría que necesitas, haz clic aquí para crear una nueva categoría al instante.",
            side: "left",
            align: "center"
        }
    },
    {
        element: "[data-tour='product-image']",
        popover: {
            title: "📸 Imagen del Producto",
            description: "Sube una foto del producto. Haz clic en el área o arrastra una imagen. Una buena foto ayuda a vender más.",
            side: "top",
            align: "center"
        }
    },
    {
        element: "[data-tour='product-available']",
        popover: {
            title: "✅ Producto Disponible",
            description: "Marca esta casilla si el producto está disponible para venta. Desmárcala si está temporalmente agotado.",
            side: "right",
            align: "start"
        }
    },
    {
        element: "[data-tour='submit-product']",
        popover: {
            title: "💾 Guardar Producto",
            description: "Cuando hayas llenado todos los campos, haz clic aquí para guardar el producto. Aparecerá inmediatamente en tu catálogo.",
            side: "top",
            align: "center"
        }
    }
];

export const categoriesTour: DriveStep[] = [
    {
        element: "#create-category-btn",
        popover: {
            title: "➕ Crear Nueva Categoría",
            description: "Crea categorías para organizar tus productos. Ejemplo: Electrónica, Ropa, Alimentos.",
            side: "bottom",
            align: "start"
        }
    },
    {
        element: "[data-tour='category-card']",
        popover: {
            title: "📁 Tarjeta de Categoría",
            description: "Muestra el nombre, slug (URL) y cuántos productos están asignados a esta categoría.",
            side: "right",
            align: "start"
        }
    },
    {
        element: "[data-tour='product-count']",
        popover: {
            title: "🔢 Contador de Productos",
            description: "Este número indica cuántos productos están usando esta categoría actualmente.",
            side: "bottom",
            align: "center"
        }
    },
    {
        element: "#categories-info",
        popover: {
            title: "⚠️ Protección de Eliminación",
            description: "No puedes eliminar categorías que tengan productos asignados. Esto previene perder datos accidentalmente.",
            side: "top",
            align: "center"
        }
    }
];

export const createCategoryTour: DriveStep[] = [
    {
        element: "[data-tour='category-name']",
        popover: {
            title: "📝 Nombre de la Categoría",
            description: "Ingresa el nombre de la categoría. Ejemplo: 'Electrónica', 'Ropa', 'Alimentos'. Será visible para los clientes.",
            side: "right",
            align: "start"
        }
    },
    {
        element: "[data-tour='category-slug']",
        popover: {
            title: "🔗 Slug (URL)",
            description: "Se genera automáticamente del nombre. Es la parte de la URL: /categoria/electronica. Usa solo minúsculas y guiones.",
            side: "right",
            align: "start"
        }
    },
    {
        element: "[data-tour='category-description']",
        popover: {
            title: "📄 Descripción (Opcional)",
            description: "Descripción breve de qué productos incluye esta categoría. Ayuda a los clientes a entender mejor la organización.",
            side: "right",
            align: "start"
        }
    },
    {
        element: "[data-tour='submit-category']",
        popover: {
            title: "💾 Guardar Categoría",
            description: "Haz clic aquí para crear la categoría. Luego podrás asignar productos a esta categoría desde el formulario de productos.",
            side: "top",
            align: "center"
        }
    }
];

export const brandsTour: DriveStep[] = [
    {
        element: "#create-brand-btn",
        popover: {
            title: "➕ Crear Nueva Marca",
            description: "Agrega marcas de productos o aliados que trabajan contigo. Se mostrarán en la landing page.",
            side: "bottom",
            align: "start"
        }
    },
    {
        element: "[data-tour='brand-card']",
        popover: {
            title: "🏢 Tarjeta de Marca",
            description: "Muestra el logo de la marca y su posición en el carrusel de la landing page.",
            side: "right",
            align: "start"
        }
    },
    {
        element: "[data-tour='upload-logo']",
        popover: {
            title: "📤 Subir Logo",
            description: "Puedes subir el logo directamente desde tu computadora o pegar una URL de imagen.",
            side: "bottom",
            align: "center"
        }
    },
    {
        element: "[data-tour='brand-active']",
        popover: {
            title: "✅ Activar/Desactivar",
            description: "Controla si esta marca se muestra en la landing page. Solo las marcas activas son visibles.",
            side: "left",
            align: "center"
        }
    },
    {
        element: "[data-tour='brand-order']",
        popover: {
            title: "🔢 Orden en Carrusel",
            description: "Define en qué posición aparece esta marca en el carrusel. Menor número = aparece primero.",
            side: "bottom",
            align: "center"
        }
    }
];

export const ordersTour: DriveStep[] = [
    {
        element: "#orders-filters",
        popover: {
            title: "🔍 Filtros de Órdenes",
            description: "Filtra órdenes por estado: Pendiente, En Proceso, Completada, Cancelada.",
            side: "bottom",
            align: "start"
        }
    },
    {
        element: "[data-tour='order-card']",
        popover: {
            title: "🛒 Tarjeta de Orden",
            description: "Muestra el número de orden, cliente, total y estado actual.",
            side: "right",
            align: "start"
        }
    },
    {
        element: "[data-tour='order-status']",
        popover: {
            title: "📊 Estado de la Orden",
            description: "Indica en qué etapa está la orden: pendiente, en proceso, completada o cancelada.",
            side: "left",
            align: "center"
        }
    },
    {
        element: "[data-tour='change-status']",
        popover: {
            title: "🔄 Cambiar Estado",
            description: "Haz clic aquí para actualizar el estado de la orden según avance el proceso.",
            side: "bottom",
            align: "center"
        }
    },
    {
        element: "[data-tour='order-details']",
        popover: {
            title: "ℹ️ Ver Detalles",
            description: "Ver todos los productos en la orden, dirección de envío y información del cliente.",
            side: "left",
            align: "center"
        }
    }
];

export function startTour(tourSteps: DriveStep[]) {
    const driverObj = driver({
        showProgress: true,
        showButtons: ["next", "previous", "close"],
        progressText: "{{current}} de {{total}}",
        nextBtnText: "Siguiente →",
        prevBtnText: "← Anterior",
        doneBtnText: "¡Entendido!",
        popoverClass: "driverjs-theme",
        steps: tourSteps,
        onDestroyStarted: () => {
            driverObj.destroy();
        }
    });

    driverObj.drive();
}
