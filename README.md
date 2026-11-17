# web-dev-Assignmnet-3

# Inventory and Data Management System

A simple REST API to manage a store's products. You can add, view, update and delete products, change stock levels, and see reports on low stock and category-wise inventory.

Built with Node.js, Express, MongoDB and Mongoose.

Render Deployed Link: https://inventory-api-ajmy.onrender.com/ [**Note:** I've hosted this on Render's free plan, which puts the server to sleep when it hasn't been used for a while. So if you open the link and it loads slowly, please give it a minute, it's just waking up. I haven't set up an uptime monitor, so if you plan to check the deployed link, just let me know beforehand and I'll make sure the server is awake and ready for you.]

## How to run

```bash
npm install
npm start
```

Create a `.env` file first:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

## API endpoints

Base URL: `http://localhost:5000/api/products`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create product |
| GET | `/` | Get all products (filter, sort, pagination) |
| GET | `/:id` | Get single product |
| PUT | `/:id` | Update product |
| PATCH | `/:id/stock` | Restock or sell |
| DELETE | `/:id` | Delete product |
| GET | `/low-stock` | Low-stock report |
| GET | `/summary` | Category-wise summary |

## Screenshots

### Create Product (POST)

<img width="1917" height="960" alt="Screenshot 2026-11-17 234628" src="https://github.com/user-attachments/assets/5c73e03b-8b79-464e-b6cf-96a9233dd245" />
<img width="1917" height="957" alt="Screenshot 2026-11-17 234649" src="https://github.com/user-attachments/assets/95d2496d-c976-402a-a41c-0d5425e6002d" />



### Get All Products (GET)

<img width="1917" height="953" alt="Screenshot 2026-11-17 235131" src="https://github.com/user-attachments/assets/4e6571d8-c937-4eb0-8b1c-31398265fc57" />


### Get Single Product (GET)

<img width="1917" height="966" alt="Screenshot 2026-11-17 235200" src="https://github.com/user-attachments/assets/16f4cb7d-015c-4cac-a8a5-8e3fe8834187" />


### Update Product (PUT)

<img width="1917" height="957" alt="Screenshot 2026-11-18 001956" src="https://github.com/user-attachments/assets/61caadfb-c3d0-4713-aa8c-a587846033b3" />


### Delete Product (DELETE)

<img width="1916" height="905" alt="Screenshot 2026-11-18 002143" src="https://github.com/user-attachments/assets/1efd693c-e64a-4c7b-a264-c46983235d28" />


### Category Summary (GET)

<img width="1916" height="967" alt="Screenshot 2026-11-18 001547" src="https://github.com/user-attachments/assets/ac5f5c51-b63a-42b3-8859-82ed377620fe" />
