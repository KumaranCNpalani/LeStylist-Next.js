/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/admin/services/route";
exports.ids = ["app/api/admin/services/route"];
exports.modules = {

/***/ "(rsc)/./app/api/admin/services/route.ts":
/*!*****************************************!*\
  !*** ./app/api/admin/services/route.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE),\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   PUT: () => (/* binding */ PUT)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/api/server.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/.pnpm/jsonwebtoken@9.0.2/node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _lib_upload__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/upload */ \"(rsc)/./lib/upload.ts\");\n/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! fs/promises */ \"fs/promises\");\n/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(fs_promises__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\nconst JWT_SECRET = process.env.JWT_SECRET || \"your-secret-key-change-this\";\nfunction verifyAdmin(request) {\n    const token = request.headers.get(\"authorization\")?.replace(\"Bearer \", \"\") || request.cookies.get(\"admin_token\")?.value;\n    if (!token) {\n        return null;\n    }\n    try {\n        const decoded = jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().verify(token, JWT_SECRET);\n        return decoded;\n    } catch (error) {\n        return null;\n    }\n}\nfunction generateSlug(name) {\n    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');\n}\n// GET - Fetch all services with category details\nasync function GET(request) {\n    try {\n        const url = new URL(request.url);\n        const categoryId = url.searchParams.get('categoryId');\n        const type = url.searchParams.get('type') // 'women', 'men', etc.\n        ;\n        let sql = `\n      SELECT s.*, c.name as category_name, c.type as category_type, c.slug as category_slug\n      FROM services s\n      JOIN service_categories c ON s.category_id = c.id\n      WHERE 1=1\n    `;\n        let params = [];\n        if (categoryId) {\n            sql += ` AND s.category_id = ?`;\n            params.push(categoryId);\n        }\n        if (type) {\n            sql += ` AND c.type = ?`;\n            params.push(type);\n        }\n        sql += ` ORDER BY c.type, c.display_order, s.display_order, s.name`;\n        const services = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_2__.query)(sql, params);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            services\n        });\n    } catch (error) {\n        console.error(\"Database error fetching services:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to fetch services\"\n        }, {\n            status: 500\n        });\n    }\n}\n// POST - Create new service\nasync function POST(request) {\n    const admin = verifyAdmin(request);\n    if (!admin) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unauthorized\"\n        }, {\n            status: 401\n        });\n    }\n    try {\n        const formData = await request.formData();\n        const category_id = formData.get('category_id');\n        const name = formData.get('name');\n        const description = formData.get('description');\n        const price = formData.get('price');\n        const price_type = formData.get('price_type') || 'fixed';\n        const duration_minutes = formData.get('duration_minutes') || 30;\n        const is_featured = formData.get('is_featured') === 'true' ? 1 : 0;\n        const is_active = formData.get('is_active') === 'true' ? 1 : 0;\n        const display_order = formData.get('display_order') || 0;\n        const image = formData.get('image');\n        if (!category_id || !name || !price) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Category, service name, and price are required\"\n            }, {\n                status: 400\n            });\n        }\n        let image_url = null;\n        if (image && image.size > 0) {\n            if (!image.type.startsWith('image/')) {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    error: \"Invalid image file\"\n                }, {\n                    status: 400\n                });\n            }\n            image_url = await (0,_lib_upload__WEBPACK_IMPORTED_MODULE_3__.uploadFile)(image, 'services');\n        }\n        const slug = generateSlug(name) + '-' + Date.now().toString().slice(-4);\n        const result = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_2__.query)(`INSERT INTO services\n       (category_id, name, slug, description, price, price_type, duration_minutes, is_featured, is_active, display_order, image_url)\n       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [\n            category_id,\n            name,\n            slug,\n            description || null,\n            price,\n            price_type,\n            duration_minutes,\n            is_featured,\n            is_active,\n            display_order,\n            image_url\n        ]);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            message: \"Service created successfully\",\n            serviceId: result.insertId\n        });\n    } catch (error) {\n        console.error(\"Error creating service:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to create service\"\n        }, {\n            status: 500\n        });\n    }\n}\n// PUT - Update service\nasync function PUT(request) {\n    const admin = verifyAdmin(request);\n    if (!admin) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unauthorized\"\n        }, {\n            status: 401\n        });\n    }\n    try {\n        const formData = await request.formData();\n        const id = formData.get('id');\n        const category_id = formData.get('category_id');\n        const name = formData.get('name');\n        const description = formData.get('description');\n        const price = formData.get('price');\n        const price_type = formData.get('price_type');\n        const duration_minutes = formData.get('duration_minutes');\n        const is_featured = formData.get('is_featured') === 'true' ? 1 : 0;\n        const is_active = formData.get('is_active') === 'true' ? 1 : 0;\n        const display_order = formData.get('display_order');\n        const image = formData.get('image');\n        if (!id || !category_id || !name || !price) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"ID, category, service name, and price are required\"\n            }, {\n                status: 400\n            });\n        }\n        let sql = `UPDATE services SET\n      category_id = ?, name = ?, description = ?,\n      price = ?, price_type = ?, duration_minutes = ?, is_featured = ?, is_active = ?,\n      display_order = ?, updated_at = CURRENT_TIMESTAMP`;\n        const params = [\n            category_id,\n            name,\n            description || null,\n            price,\n            price_type || 'fixed',\n            duration_minutes || 30,\n            is_featured,\n            is_active,\n            display_order\n        ];\n        if (image && image.size > 0) {\n            if (!image.type.startsWith('image/')) {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    error: \"Invalid image file\"\n                }, {\n                    status: 400\n                });\n            }\n            const image_url = await (0,_lib_upload__WEBPACK_IMPORTED_MODULE_3__.uploadFile)(image, 'services');\n            sql += `, image_url = ?`;\n            params.push(image_url);\n        // Optional: Delete old image here if needed\n        }\n        sql += ` WHERE id = ?`;\n        params.push(id);\n        await (0,_lib_db__WEBPACK_IMPORTED_MODULE_2__.query)(sql, params);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            message: \"Service updated successfully\"\n        });\n    } catch (error) {\n        console.error(\"Error updating service:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to update service\"\n        }, {\n            status: 500\n        });\n    }\n}\n// DELETE - Delete service\nasync function DELETE(request) {\n    const admin = verifyAdmin(request);\n    if (!admin) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unauthorized\"\n        }, {\n            status: 401\n        });\n    }\n    try {\n        const url = new URL(request.url);\n        const id = url.searchParams.get('id');\n        if (!id) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Service ID is required\"\n            }, {\n                status: 400\n            });\n        }\n        // Get image url to delete file\n        const services = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_2__.query)(\"SELECT image_url FROM services WHERE id = ?\", [\n            id\n        ]);\n        if (services.length > 0 && services[0].image_url) {\n            try {\n                const filepath = (0,path__WEBPACK_IMPORTED_MODULE_5__.join)(process.cwd(), 'public', services[0].image_url);\n                await (0,fs_promises__WEBPACK_IMPORTED_MODULE_4__.unlink)(filepath);\n            } catch (e) {\n            // Ignore file delete error\n            }\n        }\n        await (0,_lib_db__WEBPACK_IMPORTED_MODULE_2__.query)(\"DELETE FROM services WHERE id = ?\", [\n            id\n        ]);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true,\n            message: \"Service deleted successfully\"\n        });\n    } catch (error) {\n        console.error(\"Database error deleting service:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to delete service\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2FkbWluL3NlcnZpY2VzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBdUQ7QUFDekI7QUFDRTtBQUNTO0FBQ0w7QUFDVDtBQUUzQixNQUFNTSxhQUFhQyxRQUFRQyxHQUFHLENBQUNGLFVBQVUsSUFBSTtBQUU3QyxTQUFTRyxZQUFZQyxPQUFvQjtJQUN2QyxNQUFNQyxRQUFRRCxRQUFRRSxPQUFPLENBQUNDLEdBQUcsQ0FBQyxrQkFBa0JDLFFBQVEsV0FBVyxPQUNyRUosUUFBUUssT0FBTyxDQUFDRixHQUFHLENBQUMsZ0JBQWdCRztJQUV0QyxJQUFJLENBQUNMLE9BQU87UUFDVixPQUFPO0lBQ1Q7SUFFQSxJQUFJO1FBQ0YsTUFBTU0sVUFBVWhCLDBEQUFVLENBQUNVLE9BQU9MO1FBQ2xDLE9BQU9XO0lBQ1QsRUFBRSxPQUFPRSxPQUFPO1FBQ2QsT0FBTztJQUNUO0FBQ0Y7QUFFQSxTQUFTQyxhQUFhQyxJQUFZO0lBQ2hDLE9BQU9BLEtBQ0pDLFdBQVcsR0FDWFIsT0FBTyxDQUFDLGVBQWUsS0FDdkJBLE9BQU8sQ0FBQyxhQUFhO0FBQzFCO0FBRUEsaURBQWlEO0FBQzFDLGVBQWVTLElBQUliLE9BQW9CO0lBQzVDLElBQUk7UUFDRixNQUFNYyxNQUFNLElBQUlDLElBQUlmLFFBQVFjLEdBQUc7UUFDL0IsTUFBTUUsYUFBYUYsSUFBSUcsWUFBWSxDQUFDZCxHQUFHLENBQUM7UUFDeEMsTUFBTWUsT0FBT0osSUFBSUcsWUFBWSxDQUFDZCxHQUFHLENBQUMsUUFBUSx1QkFBdUI7O1FBRWpFLElBQUlnQixNQUFNLENBQUM7Ozs7O0lBS1gsQ0FBQztRQUNELElBQUlDLFNBQWdCLEVBQUU7UUFFdEIsSUFBSUosWUFBWTtZQUNkRyxPQUFPLENBQUMsc0JBQXNCLENBQUM7WUFDL0JDLE9BQU9DLElBQUksQ0FBQ0w7UUFDZDtRQUVBLElBQUlFLE1BQU07WUFDUkMsT0FBTyxDQUFDLGVBQWUsQ0FBQztZQUN4QkMsT0FBT0MsSUFBSSxDQUFDSDtRQUNkO1FBRUFDLE9BQU8sQ0FBQywwREFBMEQsQ0FBQztRQUVuRSxNQUFNRyxXQUFXLE1BQU05Qiw4Q0FBS0EsQ0FBQzJCLEtBQUtDO1FBRWxDLE9BQU85QixxREFBWUEsQ0FBQ2lDLElBQUksQ0FBQztZQUFFRDtRQUFTO0lBQ3RDLEVBQUUsT0FBT2IsT0FBTztRQUNkZSxRQUFRZixLQUFLLENBQUMscUNBQXFDQTtRQUNuRCxPQUFPbkIscURBQVlBLENBQUNpQyxJQUFJLENBQUM7WUFBRWQsT0FBTztRQUEyQixHQUFHO1lBQUVnQixRQUFRO1FBQUk7SUFDaEY7QUFDRjtBQUVBLDRCQUE0QjtBQUNyQixlQUFlQyxLQUFLMUIsT0FBb0I7SUFDN0MsTUFBTTJCLFFBQVE1QixZQUFZQztJQUMxQixJQUFJLENBQUMyQixPQUFPO1FBQ1YsT0FBT3JDLHFEQUFZQSxDQUFDaUMsSUFBSSxDQUFDO1lBQUVkLE9BQU87UUFBZSxHQUFHO1lBQUVnQixRQUFRO1FBQUk7SUFDcEU7SUFFQSxJQUFJO1FBQ0YsTUFBTUcsV0FBVyxNQUFNNUIsUUFBUTRCLFFBQVE7UUFDdkMsTUFBTUMsY0FBY0QsU0FBU3pCLEdBQUcsQ0FBQztRQUNqQyxNQUFNUSxPQUFPaUIsU0FBU3pCLEdBQUcsQ0FBQztRQUMxQixNQUFNMkIsY0FBY0YsU0FBU3pCLEdBQUcsQ0FBQztRQUNqQyxNQUFNNEIsUUFBUUgsU0FBU3pCLEdBQUcsQ0FBQztRQUMzQixNQUFNNkIsYUFBYUosU0FBU3pCLEdBQUcsQ0FBQyxpQkFBaUI7UUFDakQsTUFBTThCLG1CQUFtQkwsU0FBU3pCLEdBQUcsQ0FBQyx1QkFBdUI7UUFDN0QsTUFBTStCLGNBQWNOLFNBQVN6QixHQUFHLENBQUMsbUJBQW1CLFNBQVMsSUFBSTtRQUNqRSxNQUFNZ0MsWUFBWVAsU0FBU3pCLEdBQUcsQ0FBQyxpQkFBaUIsU0FBUyxJQUFJO1FBQzdELE1BQU1pQyxnQkFBZ0JSLFNBQVN6QixHQUFHLENBQUMsb0JBQW9CO1FBQ3ZELE1BQU1rQyxRQUFRVCxTQUFTekIsR0FBRyxDQUFDO1FBRTNCLElBQUksQ0FBQzBCLGVBQWUsQ0FBQ2xCLFFBQVEsQ0FBQ29CLE9BQU87WUFDbkMsT0FBT3pDLHFEQUFZQSxDQUFDaUMsSUFBSSxDQUFDO2dCQUN2QmQsT0FBTztZQUNULEdBQUc7Z0JBQUVnQixRQUFRO1lBQUk7UUFDbkI7UUFFQSxJQUFJYSxZQUFZO1FBQ2hCLElBQUlELFNBQVNBLE1BQU1FLElBQUksR0FBRyxHQUFHO1lBQzNCLElBQUksQ0FBQ0YsTUFBTW5CLElBQUksQ0FBQ3NCLFVBQVUsQ0FBQyxXQUFXO2dCQUNwQyxPQUFPbEQscURBQVlBLENBQUNpQyxJQUFJLENBQUM7b0JBQUVkLE9BQU87Z0JBQXFCLEdBQUc7b0JBQUVnQixRQUFRO2dCQUFJO1lBQzFFO1lBQ0FhLFlBQVksTUFBTTdDLHVEQUFVQSxDQUFDNEMsT0FBTztRQUN0QztRQUVBLE1BQU1JLE9BQU8vQixhQUFhQyxRQUFRLE1BQU0rQixLQUFLQyxHQUFHLEdBQUdDLFFBQVEsR0FBR0MsS0FBSyxDQUFDLENBQUM7UUFFckUsTUFBTUMsU0FBUyxNQUFNdEQsOENBQUtBLENBQ3hCLENBQUM7OytDQUV3QyxDQUFDLEVBQzFDO1lBQUNxQztZQUFhbEI7WUFBTThCO1lBQU1YLGVBQWU7WUFBTUM7WUFBT0M7WUFBWUM7WUFBa0JDO1lBQWFDO1lBQVdDO1lBQWVFO1NBQVU7UUFHdkksT0FBT2hELHFEQUFZQSxDQUFDaUMsSUFBSSxDQUFDO1lBQ3ZCd0IsU0FBUztZQUNUQyxTQUFTO1lBQ1RDLFdBQVdILE9BQU9JLFFBQVE7UUFDNUI7SUFDRixFQUFFLE9BQU96QyxPQUFPO1FBQ2RlLFFBQVFmLEtBQUssQ0FBQywyQkFBMkJBO1FBQ3pDLE9BQU9uQixxREFBWUEsQ0FBQ2lDLElBQUksQ0FBQztZQUFFZCxPQUFPO1FBQTJCLEdBQUc7WUFBRWdCLFFBQVE7UUFBSTtJQUNoRjtBQUNGO0FBRUEsdUJBQXVCO0FBQ2hCLGVBQWUwQixJQUFJbkQsT0FBb0I7SUFDNUMsTUFBTTJCLFFBQVE1QixZQUFZQztJQUMxQixJQUFJLENBQUMyQixPQUFPO1FBQ1YsT0FBT3JDLHFEQUFZQSxDQUFDaUMsSUFBSSxDQUFDO1lBQUVkLE9BQU87UUFBZSxHQUFHO1lBQUVnQixRQUFRO1FBQUk7SUFDcEU7SUFFQSxJQUFJO1FBQ0YsTUFBTUcsV0FBVyxNQUFNNUIsUUFBUTRCLFFBQVE7UUFDdkMsTUFBTXdCLEtBQUt4QixTQUFTekIsR0FBRyxDQUFDO1FBQ3hCLE1BQU0wQixjQUFjRCxTQUFTekIsR0FBRyxDQUFDO1FBQ2pDLE1BQU1RLE9BQU9pQixTQUFTekIsR0FBRyxDQUFDO1FBQzFCLE1BQU0yQixjQUFjRixTQUFTekIsR0FBRyxDQUFDO1FBQ2pDLE1BQU00QixRQUFRSCxTQUFTekIsR0FBRyxDQUFDO1FBQzNCLE1BQU02QixhQUFhSixTQUFTekIsR0FBRyxDQUFDO1FBQ2hDLE1BQU04QixtQkFBbUJMLFNBQVN6QixHQUFHLENBQUM7UUFDdEMsTUFBTStCLGNBQWNOLFNBQVN6QixHQUFHLENBQUMsbUJBQW1CLFNBQVMsSUFBSTtRQUNqRSxNQUFNZ0MsWUFBWVAsU0FBU3pCLEdBQUcsQ0FBQyxpQkFBaUIsU0FBUyxJQUFJO1FBQzdELE1BQU1pQyxnQkFBZ0JSLFNBQVN6QixHQUFHLENBQUM7UUFDbkMsTUFBTWtDLFFBQVFULFNBQVN6QixHQUFHLENBQUM7UUFFM0IsSUFBSSxDQUFDaUQsTUFBTSxDQUFDdkIsZUFBZSxDQUFDbEIsUUFBUSxDQUFDb0IsT0FBTztZQUMxQyxPQUFPekMscURBQVlBLENBQUNpQyxJQUFJLENBQUM7Z0JBQ3ZCZCxPQUFPO1lBQ1QsR0FBRztnQkFBRWdCLFFBQVE7WUFBSTtRQUNuQjtRQUVBLElBQUlOLE1BQU0sQ0FBQzs7O3VEQUd3QyxDQUFDO1FBRXBELE1BQU1DLFNBQVM7WUFDYlM7WUFBYWxCO1lBQU1tQixlQUFlO1lBQ2xDQztZQUFPQyxjQUFjO1lBQVNDLG9CQUFvQjtZQUNsREM7WUFBYUM7WUFBV0M7U0FDekI7UUFFRCxJQUFJQyxTQUFTQSxNQUFNRSxJQUFJLEdBQUcsR0FBRztZQUMzQixJQUFJLENBQUNGLE1BQU1uQixJQUFJLENBQUNzQixVQUFVLENBQUMsV0FBVztnQkFDcEMsT0FBT2xELHFEQUFZQSxDQUFDaUMsSUFBSSxDQUFDO29CQUFFZCxPQUFPO2dCQUFxQixHQUFHO29CQUFFZ0IsUUFBUTtnQkFBSTtZQUMxRTtZQUNBLE1BQU1hLFlBQVksTUFBTTdDLHVEQUFVQSxDQUFDNEMsT0FBTztZQUMxQ2xCLE9BQU8sQ0FBQyxlQUFlLENBQUM7WUFDeEJDLE9BQU9DLElBQUksQ0FBQ2lCO1FBRVosNENBQTRDO1FBQzlDO1FBRUFuQixPQUFPLENBQUMsYUFBYSxDQUFDO1FBQ3RCQyxPQUFPQyxJQUFJLENBQUMrQjtRQUVaLE1BQU01RCw4Q0FBS0EsQ0FBQzJCLEtBQUtDO1FBRWpCLE9BQU85QixxREFBWUEsQ0FBQ2lDLElBQUksQ0FBQztZQUN2QndCLFNBQVM7WUFDVEMsU0FBUztRQUNYO0lBQ0YsRUFBRSxPQUFPdkMsT0FBTztRQUNkZSxRQUFRZixLQUFLLENBQUMsMkJBQTJCQTtRQUN6QyxPQUFPbkIscURBQVlBLENBQUNpQyxJQUFJLENBQUM7WUFBRWQsT0FBTztRQUEyQixHQUFHO1lBQUVnQixRQUFRO1FBQUk7SUFDaEY7QUFDRjtBQUVBLDBCQUEwQjtBQUNuQixlQUFlNEIsT0FBT3JELE9BQW9CO0lBQy9DLE1BQU0yQixRQUFRNUIsWUFBWUM7SUFDMUIsSUFBSSxDQUFDMkIsT0FBTztRQUNWLE9BQU9yQyxxREFBWUEsQ0FBQ2lDLElBQUksQ0FBQztZQUFFZCxPQUFPO1FBQWUsR0FBRztZQUFFZ0IsUUFBUTtRQUFJO0lBQ3BFO0lBRUEsSUFBSTtRQUNGLE1BQU1YLE1BQU0sSUFBSUMsSUFBSWYsUUFBUWMsR0FBRztRQUMvQixNQUFNc0MsS0FBS3RDLElBQUlHLFlBQVksQ0FBQ2QsR0FBRyxDQUFDO1FBRWhDLElBQUksQ0FBQ2lELElBQUk7WUFDUCxPQUFPOUQscURBQVlBLENBQUNpQyxJQUFJLENBQUM7Z0JBQUVkLE9BQU87WUFBeUIsR0FBRztnQkFBRWdCLFFBQVE7WUFBSTtRQUM5RTtRQUVBLCtCQUErQjtRQUMvQixNQUFNSCxXQUFXLE1BQU05Qiw4Q0FBS0EsQ0FBQywrQ0FBK0M7WUFBQzREO1NBQUc7UUFDaEYsSUFBSTlCLFNBQVNnQyxNQUFNLEdBQUcsS0FBS2hDLFFBQVEsQ0FBQyxFQUFFLENBQUNnQixTQUFTLEVBQUU7WUFDaEQsSUFBSTtnQkFDRixNQUFNaUIsV0FBVzVELDBDQUFJQSxDQUFDRSxRQUFRMkQsR0FBRyxJQUFJLFVBQVVsQyxRQUFRLENBQUMsRUFBRSxDQUFDZ0IsU0FBUztnQkFDcEUsTUFBTTVDLG1EQUFNQSxDQUFDNkQ7WUFDZixFQUFFLE9BQU9FLEdBQUc7WUFDViwyQkFBMkI7WUFDN0I7UUFDRjtRQUVBLE1BQU1qRSw4Q0FBS0EsQ0FBQyxxQ0FBcUM7WUFBQzREO1NBQUc7UUFFckQsT0FBTzlELHFEQUFZQSxDQUFDaUMsSUFBSSxDQUFDO1lBQUV3QixTQUFTO1lBQU1DLFNBQVM7UUFBK0I7SUFDcEYsRUFBRSxPQUFPdkMsT0FBTztRQUNkZSxRQUFRZixLQUFLLENBQUMsb0NBQW9DQTtRQUNsRCxPQUFPbkIscURBQVlBLENBQUNpQyxJQUFJLENBQUM7WUFBRWQsT0FBTztRQUEyQixHQUFHO1lBQUVnQixRQUFRO1FBQUk7SUFDaEY7QUFDRiIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxQYWt1bVxcRG93bmxvYWRzXFx6dG9pLXNhbG9uLXdlYnNpdGVcXGFwcFxcYXBpXFxhZG1pblxcc2VydmljZXNcXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIlxyXG5pbXBvcnQgand0IGZyb20gXCJqc29ud2VidG9rZW5cIlxyXG5pbXBvcnQgeyBxdWVyeSB9IGZyb20gXCJAL2xpYi9kYlwiXHJcbmltcG9ydCB7IHVwbG9hZEZpbGUgfSBmcm9tIFwiQC9saWIvdXBsb2FkXCJcclxuaW1wb3J0IHsgdW5saW5rIH0gZnJvbSBcImZzL3Byb21pc2VzXCJcclxuaW1wb3J0IHsgam9pbiB9IGZyb20gXCJwYXRoXCJcclxuXHJcbmNvbnN0IEpXVF9TRUNSRVQgPSBwcm9jZXNzLmVudi5KV1RfU0VDUkVUIHx8IFwieW91ci1zZWNyZXQta2V5LWNoYW5nZS10aGlzXCJcclxuXHJcbmZ1bmN0aW9uIHZlcmlmeUFkbWluKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XHJcbiAgY29uc3QgdG9rZW4gPSByZXF1ZXN0LmhlYWRlcnMuZ2V0KFwiYXV0aG9yaXphdGlvblwiKT8ucmVwbGFjZShcIkJlYXJlciBcIiwgXCJcIikgfHxcclxuICAgIHJlcXVlc3QuY29va2llcy5nZXQoXCJhZG1pbl90b2tlblwiKT8udmFsdWVcclxuXHJcbiAgaWYgKCF0b2tlbikge1xyXG4gICAgcmV0dXJuIG51bGxcclxuICB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBkZWNvZGVkID0gand0LnZlcmlmeSh0b2tlbiwgSldUX1NFQ1JFVCkgYXMgeyBpZDogbnVtYmVyOyByb2xlOiBzdHJpbmcgfVxyXG4gICAgcmV0dXJuIGRlY29kZWRcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmV0dXJuIG51bGxcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlU2x1ZyhuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiBuYW1lXHJcbiAgICAudG9Mb3dlckNhc2UoKVxyXG4gICAgLnJlcGxhY2UoL1teYS16MC05XSsvZywgJy0nKVxyXG4gICAgLnJlcGxhY2UoLyheLXwtJCkrL2csICcnKVxyXG59XHJcblxyXG4vLyBHRVQgLSBGZXRjaCBhbGwgc2VydmljZXMgd2l0aCBjYXRlZ29yeSBkZXRhaWxzXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChyZXF1ZXN0LnVybClcclxuICAgIGNvbnN0IGNhdGVnb3J5SWQgPSB1cmwuc2VhcmNoUGFyYW1zLmdldCgnY2F0ZWdvcnlJZCcpXHJcbiAgICBjb25zdCB0eXBlID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoJ3R5cGUnKSAvLyAnd29tZW4nLCAnbWVuJywgZXRjLlxyXG5cclxuICAgIGxldCBzcWwgPSBgXHJcbiAgICAgIFNFTEVDVCBzLiosIGMubmFtZSBhcyBjYXRlZ29yeV9uYW1lLCBjLnR5cGUgYXMgY2F0ZWdvcnlfdHlwZSwgYy5zbHVnIGFzIGNhdGVnb3J5X3NsdWdcclxuICAgICAgRlJPTSBzZXJ2aWNlcyBzXHJcbiAgICAgIEpPSU4gc2VydmljZV9jYXRlZ29yaWVzIGMgT04gcy5jYXRlZ29yeV9pZCA9IGMuaWRcclxuICAgICAgV0hFUkUgMT0xXHJcbiAgICBgXHJcbiAgICBsZXQgcGFyYW1zOiBhbnlbXSA9IFtdXHJcblxyXG4gICAgaWYgKGNhdGVnb3J5SWQpIHtcclxuICAgICAgc3FsICs9IGAgQU5EIHMuY2F0ZWdvcnlfaWQgPSA/YFxyXG4gICAgICBwYXJhbXMucHVzaChjYXRlZ29yeUlkKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlKSB7XHJcbiAgICAgIHNxbCArPSBgIEFORCBjLnR5cGUgPSA/YFxyXG4gICAgICBwYXJhbXMucHVzaCh0eXBlKVxyXG4gICAgfVxyXG5cclxuICAgIHNxbCArPSBgIE9SREVSIEJZIGMudHlwZSwgYy5kaXNwbGF5X29yZGVyLCBzLmRpc3BsYXlfb3JkZXIsIHMubmFtZWBcclxuXHJcbiAgICBjb25zdCBzZXJ2aWNlcyA9IGF3YWl0IHF1ZXJ5KHNxbCwgcGFyYW1zKSBhcyBhbnlbXVxyXG5cclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHNlcnZpY2VzIH0pXHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJEYXRhYmFzZSBlcnJvciBmZXRjaGluZyBzZXJ2aWNlczpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJGYWlsZWQgdG8gZmV0Y2ggc2VydmljZXNcIiB9LCB7IHN0YXR1czogNTAwIH0pXHJcbiAgfVxyXG59XHJcblxyXG4vLyBQT1NUIC0gQ3JlYXRlIG5ldyBzZXJ2aWNlXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XHJcbiAgY29uc3QgYWRtaW4gPSB2ZXJpZnlBZG1pbihyZXF1ZXN0KVxyXG4gIGlmICghYWRtaW4pIHtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIlVuYXV0aG9yaXplZFwiIH0sIHsgc3RhdHVzOiA0MDEgfSlcclxuICB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IGF3YWl0IHJlcXVlc3QuZm9ybURhdGEoKVxyXG4gICAgY29uc3QgY2F0ZWdvcnlfaWQgPSBmb3JtRGF0YS5nZXQoJ2NhdGVnb3J5X2lkJylcclxuICAgIGNvbnN0IG5hbWUgPSBmb3JtRGF0YS5nZXQoJ25hbWUnKSBhcyBzdHJpbmdcclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gZm9ybURhdGEuZ2V0KCdkZXNjcmlwdGlvbicpIGFzIHN0cmluZ1xyXG4gICAgY29uc3QgcHJpY2UgPSBmb3JtRGF0YS5nZXQoJ3ByaWNlJylcclxuICAgIGNvbnN0IHByaWNlX3R5cGUgPSBmb3JtRGF0YS5nZXQoJ3ByaWNlX3R5cGUnKSB8fCAnZml4ZWQnXHJcbiAgICBjb25zdCBkdXJhdGlvbl9taW51dGVzID0gZm9ybURhdGEuZ2V0KCdkdXJhdGlvbl9taW51dGVzJykgfHwgMzBcclxuICAgIGNvbnN0IGlzX2ZlYXR1cmVkID0gZm9ybURhdGEuZ2V0KCdpc19mZWF0dXJlZCcpID09PSAndHJ1ZScgPyAxIDogMFxyXG4gICAgY29uc3QgaXNfYWN0aXZlID0gZm9ybURhdGEuZ2V0KCdpc19hY3RpdmUnKSA9PT0gJ3RydWUnID8gMSA6IDBcclxuICAgIGNvbnN0IGRpc3BsYXlfb3JkZXIgPSBmb3JtRGF0YS5nZXQoJ2Rpc3BsYXlfb3JkZXInKSB8fCAwXHJcbiAgICBjb25zdCBpbWFnZSA9IGZvcm1EYXRhLmdldCgnaW1hZ2UnKSBhcyBGaWxlIHwgbnVsbFxyXG5cclxuICAgIGlmICghY2F0ZWdvcnlfaWQgfHwgIW5hbWUgfHwgIXByaWNlKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XHJcbiAgICAgICAgZXJyb3I6IFwiQ2F0ZWdvcnksIHNlcnZpY2UgbmFtZSwgYW5kIHByaWNlIGFyZSByZXF1aXJlZFwiXHJcbiAgICAgIH0sIHsgc3RhdHVzOiA0MDAgfSlcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaW1hZ2VfdXJsID0gbnVsbFxyXG4gICAgaWYgKGltYWdlICYmIGltYWdlLnNpemUgPiAwKSB7XHJcbiAgICAgIGlmICghaW1hZ2UudHlwZS5zdGFydHNXaXRoKCdpbWFnZS8nKSkge1xyXG4gICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIkludmFsaWQgaW1hZ2UgZmlsZVwiIH0sIHsgc3RhdHVzOiA0MDAgfSlcclxuICAgICAgfVxyXG4gICAgICBpbWFnZV91cmwgPSBhd2FpdCB1cGxvYWRGaWxlKGltYWdlLCAnc2VydmljZXMnKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNsdWcgPSBnZW5lcmF0ZVNsdWcobmFtZSkgKyAnLScgKyBEYXRlLm5vdygpLnRvU3RyaW5nKCkuc2xpY2UoLTQpXHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlcnkoXHJcbiAgICAgIGBJTlNFUlQgSU5UTyBzZXJ2aWNlc1xyXG4gICAgICAgKGNhdGVnb3J5X2lkLCBuYW1lLCBzbHVnLCBkZXNjcmlwdGlvbiwgcHJpY2UsIHByaWNlX3R5cGUsIGR1cmF0aW9uX21pbnV0ZXMsIGlzX2ZlYXR1cmVkLCBpc19hY3RpdmUsIGRpc3BsYXlfb3JkZXIsIGltYWdlX3VybClcclxuICAgICAgIFZBTFVFUyAoPywgPywgPywgPywgPywgPywgPywgPywgPywgPywgPylgLFxyXG4gICAgICBbY2F0ZWdvcnlfaWQsIG5hbWUsIHNsdWcsIGRlc2NyaXB0aW9uIHx8IG51bGwsIHByaWNlLCBwcmljZV90eXBlLCBkdXJhdGlvbl9taW51dGVzLCBpc19mZWF0dXJlZCwgaXNfYWN0aXZlLCBkaXNwbGF5X29yZGVyLCBpbWFnZV91cmxdXHJcbiAgICApIGFzIGFueVxyXG5cclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XHJcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgIG1lc3NhZ2U6IFwiU2VydmljZSBjcmVhdGVkIHN1Y2Nlc3NmdWxseVwiLFxyXG4gICAgICBzZXJ2aWNlSWQ6IHJlc3VsdC5pbnNlcnRJZFxyXG4gICAgfSlcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGNyZWF0aW5nIHNlcnZpY2U6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiRmFpbGVkIHRvIGNyZWF0ZSBzZXJ2aWNlXCIgfSwgeyBzdGF0dXM6IDUwMCB9KVxyXG4gIH1cclxufVxyXG5cclxuLy8gUFVUIC0gVXBkYXRlIHNlcnZpY2VcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBVVChyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xyXG4gIGNvbnN0IGFkbWluID0gdmVyaWZ5QWRtaW4ocmVxdWVzdClcclxuICBpZiAoIWFkbWluKSB7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJVbmF1dGhvcml6ZWRcIiB9LCB7IHN0YXR1czogNDAxIH0pXHJcbiAgfVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgZm9ybURhdGEgPSBhd2FpdCByZXF1ZXN0LmZvcm1EYXRhKClcclxuICAgIGNvbnN0IGlkID0gZm9ybURhdGEuZ2V0KCdpZCcpXHJcbiAgICBjb25zdCBjYXRlZ29yeV9pZCA9IGZvcm1EYXRhLmdldCgnY2F0ZWdvcnlfaWQnKVxyXG4gICAgY29uc3QgbmFtZSA9IGZvcm1EYXRhLmdldCgnbmFtZScpIGFzIHN0cmluZ1xyXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSBmb3JtRGF0YS5nZXQoJ2Rlc2NyaXB0aW9uJykgYXMgc3RyaW5nXHJcbiAgICBjb25zdCBwcmljZSA9IGZvcm1EYXRhLmdldCgncHJpY2UnKVxyXG4gICAgY29uc3QgcHJpY2VfdHlwZSA9IGZvcm1EYXRhLmdldCgncHJpY2VfdHlwZScpXHJcbiAgICBjb25zdCBkdXJhdGlvbl9taW51dGVzID0gZm9ybURhdGEuZ2V0KCdkdXJhdGlvbl9taW51dGVzJylcclxuICAgIGNvbnN0IGlzX2ZlYXR1cmVkID0gZm9ybURhdGEuZ2V0KCdpc19mZWF0dXJlZCcpID09PSAndHJ1ZScgPyAxIDogMFxyXG4gICAgY29uc3QgaXNfYWN0aXZlID0gZm9ybURhdGEuZ2V0KCdpc19hY3RpdmUnKSA9PT0gJ3RydWUnID8gMSA6IDBcclxuICAgIGNvbnN0IGRpc3BsYXlfb3JkZXIgPSBmb3JtRGF0YS5nZXQoJ2Rpc3BsYXlfb3JkZXInKVxyXG4gICAgY29uc3QgaW1hZ2UgPSBmb3JtRGF0YS5nZXQoJ2ltYWdlJykgYXMgRmlsZSB8IG51bGxcclxuXHJcbiAgICBpZiAoIWlkIHx8ICFjYXRlZ29yeV9pZCB8fCAhbmFtZSB8fCAhcHJpY2UpIHtcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcclxuICAgICAgICBlcnJvcjogXCJJRCwgY2F0ZWdvcnksIHNlcnZpY2UgbmFtZSwgYW5kIHByaWNlIGFyZSByZXF1aXJlZFwiXHJcbiAgICAgIH0sIHsgc3RhdHVzOiA0MDAgfSlcclxuICAgIH1cclxuXHJcbiAgICBsZXQgc3FsID0gYFVQREFURSBzZXJ2aWNlcyBTRVRcclxuICAgICAgY2F0ZWdvcnlfaWQgPSA/LCBuYW1lID0gPywgZGVzY3JpcHRpb24gPSA/LFxyXG4gICAgICBwcmljZSA9ID8sIHByaWNlX3R5cGUgPSA/LCBkdXJhdGlvbl9taW51dGVzID0gPywgaXNfZmVhdHVyZWQgPSA/LCBpc19hY3RpdmUgPSA/LFxyXG4gICAgICBkaXNwbGF5X29yZGVyID0gPywgdXBkYXRlZF9hdCA9IENVUlJFTlRfVElNRVNUQU1QYFxyXG5cclxuICAgIGNvbnN0IHBhcmFtcyA9IFtcclxuICAgICAgY2F0ZWdvcnlfaWQsIG5hbWUsIGRlc2NyaXB0aW9uIHx8IG51bGwsXHJcbiAgICAgIHByaWNlLCBwcmljZV90eXBlIHx8ICdmaXhlZCcsIGR1cmF0aW9uX21pbnV0ZXMgfHwgMzAsXHJcbiAgICAgIGlzX2ZlYXR1cmVkLCBpc19hY3RpdmUsIGRpc3BsYXlfb3JkZXJcclxuICAgIF1cclxuXHJcbiAgICBpZiAoaW1hZ2UgJiYgaW1hZ2Uuc2l6ZSA+IDApIHtcclxuICAgICAgaWYgKCFpbWFnZS50eXBlLnN0YXJ0c1dpdGgoJ2ltYWdlLycpKSB7XHJcbiAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiSW52YWxpZCBpbWFnZSBmaWxlXCIgfSwgeyBzdGF0dXM6IDQwMCB9KVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGltYWdlX3VybCA9IGF3YWl0IHVwbG9hZEZpbGUoaW1hZ2UsICdzZXJ2aWNlcycpXHJcbiAgICAgIHNxbCArPSBgLCBpbWFnZV91cmwgPSA/YFxyXG4gICAgICBwYXJhbXMucHVzaChpbWFnZV91cmwpXHJcblxyXG4gICAgICAvLyBPcHRpb25hbDogRGVsZXRlIG9sZCBpbWFnZSBoZXJlIGlmIG5lZWRlZFxyXG4gICAgfVxyXG5cclxuICAgIHNxbCArPSBgIFdIRVJFIGlkID0gP2BcclxuICAgIHBhcmFtcy5wdXNoKGlkKVxyXG5cclxuICAgIGF3YWl0IHF1ZXJ5KHNxbCwgcGFyYW1zKVxyXG5cclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XHJcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgIG1lc3NhZ2U6IFwiU2VydmljZSB1cGRhdGVkIHN1Y2Nlc3NmdWxseVwiXHJcbiAgICB9KVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgdXBkYXRpbmcgc2VydmljZTpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJGYWlsZWQgdG8gdXBkYXRlIHNlcnZpY2VcIiB9LCB7IHN0YXR1czogNTAwIH0pXHJcbiAgfVxyXG59XHJcblxyXG4vLyBERUxFVEUgLSBEZWxldGUgc2VydmljZVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gREVMRVRFKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XHJcbiAgY29uc3QgYWRtaW4gPSB2ZXJpZnlBZG1pbihyZXF1ZXN0KVxyXG4gIGlmICghYWRtaW4pIHtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIlVuYXV0aG9yaXplZFwiIH0sIHsgc3RhdHVzOiA0MDEgfSlcclxuICB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHJlcXVlc3QudXJsKVxyXG4gICAgY29uc3QgaWQgPSB1cmwuc2VhcmNoUGFyYW1zLmdldCgnaWQnKVxyXG5cclxuICAgIGlmICghaWQpIHtcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiU2VydmljZSBJRCBpcyByZXF1aXJlZFwiIH0sIHsgc3RhdHVzOiA0MDAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBHZXQgaW1hZ2UgdXJsIHRvIGRlbGV0ZSBmaWxlXHJcbiAgICBjb25zdCBzZXJ2aWNlcyA9IGF3YWl0IHF1ZXJ5KFwiU0VMRUNUIGltYWdlX3VybCBGUk9NIHNlcnZpY2VzIFdIRVJFIGlkID0gP1wiLCBbaWRdKSBhcyBhbnlbXVxyXG4gICAgaWYgKHNlcnZpY2VzLmxlbmd0aCA+IDAgJiYgc2VydmljZXNbMF0uaW1hZ2VfdXJsKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZmlsZXBhdGggPSBqb2luKHByb2Nlc3MuY3dkKCksICdwdWJsaWMnLCBzZXJ2aWNlc1swXS5pbWFnZV91cmwpXHJcbiAgICAgICAgYXdhaXQgdW5saW5rKGZpbGVwYXRoKVxyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgLy8gSWdub3JlIGZpbGUgZGVsZXRlIGVycm9yXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhd2FpdCBxdWVyeShcIkRFTEVURSBGUk9NIHNlcnZpY2VzIFdIRVJFIGlkID0gP1wiLCBbaWRdKVxyXG5cclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHN1Y2Nlc3M6IHRydWUsIG1lc3NhZ2U6IFwiU2VydmljZSBkZWxldGVkIHN1Y2Nlc3NmdWxseVwiIH0pXHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJEYXRhYmFzZSBlcnJvciBkZWxldGluZyBzZXJ2aWNlOlwiLCBlcnJvcilcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIkZhaWxlZCB0byBkZWxldGUgc2VydmljZVwiIH0sIHsgc3RhdHVzOiA1MDAgfSlcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImp3dCIsInF1ZXJ5IiwidXBsb2FkRmlsZSIsInVubGluayIsImpvaW4iLCJKV1RfU0VDUkVUIiwicHJvY2VzcyIsImVudiIsInZlcmlmeUFkbWluIiwicmVxdWVzdCIsInRva2VuIiwiaGVhZGVycyIsImdldCIsInJlcGxhY2UiLCJjb29raWVzIiwidmFsdWUiLCJkZWNvZGVkIiwidmVyaWZ5IiwiZXJyb3IiLCJnZW5lcmF0ZVNsdWciLCJuYW1lIiwidG9Mb3dlckNhc2UiLCJHRVQiLCJ1cmwiLCJVUkwiLCJjYXRlZ29yeUlkIiwic2VhcmNoUGFyYW1zIiwidHlwZSIsInNxbCIsInBhcmFtcyIsInB1c2giLCJzZXJ2aWNlcyIsImpzb24iLCJjb25zb2xlIiwic3RhdHVzIiwiUE9TVCIsImFkbWluIiwiZm9ybURhdGEiLCJjYXRlZ29yeV9pZCIsImRlc2NyaXB0aW9uIiwicHJpY2UiLCJwcmljZV90eXBlIiwiZHVyYXRpb25fbWludXRlcyIsImlzX2ZlYXR1cmVkIiwiaXNfYWN0aXZlIiwiZGlzcGxheV9vcmRlciIsImltYWdlIiwiaW1hZ2VfdXJsIiwic2l6ZSIsInN0YXJ0c1dpdGgiLCJzbHVnIiwiRGF0ZSIsIm5vdyIsInRvU3RyaW5nIiwic2xpY2UiLCJyZXN1bHQiLCJzdWNjZXNzIiwibWVzc2FnZSIsInNlcnZpY2VJZCIsImluc2VydElkIiwiUFVUIiwiaWQiLCJERUxFVEUiLCJsZW5ndGgiLCJmaWxlcGF0aCIsImN3ZCIsImUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/admin/services/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   getConnection: () => (/* binding */ getConnection),\n/* harmony export */   query: () => (/* binding */ query),\n/* harmony export */   testConnection: () => (/* binding */ testConnection)\n/* harmony export */ });\n/* harmony import */ var mysql2_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mysql2/promise */ \"(rsc)/./node_modules/.pnpm/mysql2@3.15.3/node_modules/mysql2/promise.js\");\n\n// Database connection configuration\nconst dbConfig = {\n    host: process.env.DB_HOST || 'localhost',\n    port: parseInt(process.env.DB_PORT || '3306'),\n    user: process.env.DB_USER || 'root',\n    password: process.env.DB_PASSWORD || '',\n    database: process.env.DB_NAME || 'lestylist_db',\n    waitForConnections: true,\n    connectionLimit: 10,\n    queueLimit: 0\n};\n// Create connection pool\nconst pool = mysql2_promise__WEBPACK_IMPORTED_MODULE_0__.createPool(dbConfig);\n// Test connection\nasync function testConnection() {\n    try {\n        const connection = await pool.getConnection();\n        console.log('✅ MySQL Database Connected Successfully!');\n        connection.release();\n        return true;\n    } catch (error) {\n        console.error('❌ Database Connection Error:', error);\n        return false;\n    }\n}\n// Execute query helper\nasync function query(sql, params) {\n    try {\n        const [results] = await pool.execute(sql, params);\n        return results;\n    } catch (error) {\n        console.error('Database Query Error:', error);\n        throw error;\n    }\n}\n// Get connection from pool\nasync function getConnection() {\n    return await pool.getConnection();\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pool);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBa0M7QUFFbEMsb0NBQW9DO0FBQ3BDLE1BQU1DLFdBQVc7SUFDZkMsTUFBTUMsUUFBUUMsR0FBRyxDQUFDQyxPQUFPLElBQUk7SUFDN0JDLE1BQU1DLFNBQVNKLFFBQVFDLEdBQUcsQ0FBQ0ksT0FBTyxJQUFJO0lBQ3RDQyxNQUFNTixRQUFRQyxHQUFHLENBQUNNLE9BQU8sSUFBSTtJQUM3QkMsVUFBVVIsUUFBUUMsR0FBRyxDQUFDUSxXQUFXLElBQUk7SUFDckNDLFVBQVVWLFFBQVFDLEdBQUcsQ0FBQ1UsT0FBTyxJQUFJO0lBQ2pDQyxvQkFBb0I7SUFDcEJDLGlCQUFpQjtJQUNqQkMsWUFBWTtBQUNkO0FBRUEseUJBQXlCO0FBQ3pCLE1BQU1DLE9BQU9sQixzREFBZ0IsQ0FBQ0M7QUFFOUIsa0JBQWtCO0FBQ1gsZUFBZW1CO0lBQ3BCLElBQUk7UUFDRixNQUFNQyxhQUFhLE1BQU1ILEtBQUtJLGFBQWE7UUFDM0NDLFFBQVFDLEdBQUcsQ0FBQztRQUNaSCxXQUFXSSxPQUFPO1FBQ2xCLE9BQU87SUFDVCxFQUFFLE9BQU9DLE9BQU87UUFDZEgsUUFBUUcsS0FBSyxDQUFDLGdDQUFnQ0E7UUFDOUMsT0FBTztJQUNUO0FBQ0Y7QUFFQSx1QkFBdUI7QUFDaEIsZUFBZUMsTUFBTUMsR0FBVyxFQUFFQyxNQUFjO0lBQ3JELElBQUk7UUFDRixNQUFNLENBQUNDLFFBQVEsR0FBRyxNQUFNWixLQUFLYSxPQUFPLENBQUNILEtBQUtDO1FBQzFDLE9BQU9DO0lBQ1QsRUFBRSxPQUFPSixPQUFPO1FBQ2RILFFBQVFHLEtBQUssQ0FBQyx5QkFBeUJBO1FBQ3ZDLE1BQU1BO0lBQ1I7QUFDRjtBQUVBLDJCQUEyQjtBQUNwQixlQUFlSjtJQUNwQixPQUFPLE1BQU1KLEtBQUtJLGFBQWE7QUFDakM7QUFFQSxpRUFBZUosSUFBSUEsRUFBQSIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxQYWt1bVxcRG93bmxvYWRzXFx6dG9pLXNhbG9uLXdlYnNpdGVcXGxpYlxcZGIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG15c3FsIGZyb20gJ215c3FsMi9wcm9taXNlJ1xyXG5cclxuLy8gRGF0YWJhc2UgY29ubmVjdGlvbiBjb25maWd1cmF0aW9uXHJcbmNvbnN0IGRiQ29uZmlnID0ge1xyXG4gIGhvc3Q6IHByb2Nlc3MuZW52LkRCX0hPU1QgfHwgJ2xvY2FsaG9zdCcsXHJcbiAgcG9ydDogcGFyc2VJbnQocHJvY2Vzcy5lbnYuREJfUE9SVCB8fCAnMzMwNicpLFxyXG4gIHVzZXI6IHByb2Nlc3MuZW52LkRCX1VTRVIgfHwgJ3Jvb3QnLFxyXG4gIHBhc3N3b3JkOiBwcm9jZXNzLmVudi5EQl9QQVNTV09SRCB8fCAnJyxcclxuICBkYXRhYmFzZTogcHJvY2Vzcy5lbnYuREJfTkFNRSB8fCAnbGVzdHlsaXN0X2RiJyxcclxuICB3YWl0Rm9yQ29ubmVjdGlvbnM6IHRydWUsXHJcbiAgY29ubmVjdGlvbkxpbWl0OiAxMCxcclxuICBxdWV1ZUxpbWl0OiAwLFxyXG59XHJcblxyXG4vLyBDcmVhdGUgY29ubmVjdGlvbiBwb29sXHJcbmNvbnN0IHBvb2wgPSBteXNxbC5jcmVhdGVQb29sKGRiQ29uZmlnKVxyXG5cclxuLy8gVGVzdCBjb25uZWN0aW9uXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0Q29ubmVjdGlvbigpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgY29ubmVjdGlvbiA9IGF3YWl0IHBvb2wuZ2V0Q29ubmVjdGlvbigpXHJcbiAgICBjb25zb2xlLmxvZygn4pyFIE15U1FMIERhdGFiYXNlIENvbm5lY3RlZCBTdWNjZXNzZnVsbHkhJylcclxuICAgIGNvbm5lY3Rpb24ucmVsZWFzZSgpXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCfinYwgRGF0YWJhc2UgQ29ubmVjdGlvbiBFcnJvcjonLCBlcnJvcilcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxufVxyXG5cclxuLy8gRXhlY3V0ZSBxdWVyeSBoZWxwZXJcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHF1ZXJ5KHNxbDogc3RyaW5nLCBwYXJhbXM/OiBhbnlbXSkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBbcmVzdWx0c10gPSBhd2FpdCBwb29sLmV4ZWN1dGUoc3FsLCBwYXJhbXMpXHJcbiAgICByZXR1cm4gcmVzdWx0c1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdEYXRhYmFzZSBRdWVyeSBFcnJvcjonLCBlcnJvcilcclxuICAgIHRocm93IGVycm9yXHJcbiAgfVxyXG59XHJcblxyXG4vLyBHZXQgY29ubmVjdGlvbiBmcm9tIHBvb2xcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvbm5lY3Rpb24oKSB7XHJcbiAgcmV0dXJuIGF3YWl0IHBvb2wuZ2V0Q29ubmVjdGlvbigpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHBvb2xcclxuXHJcbiJdLCJuYW1lcyI6WyJteXNxbCIsImRiQ29uZmlnIiwiaG9zdCIsInByb2Nlc3MiLCJlbnYiLCJEQl9IT1NUIiwicG9ydCIsInBhcnNlSW50IiwiREJfUE9SVCIsInVzZXIiLCJEQl9VU0VSIiwicGFzc3dvcmQiLCJEQl9QQVNTV09SRCIsImRhdGFiYXNlIiwiREJfTkFNRSIsIndhaXRGb3JDb25uZWN0aW9ucyIsImNvbm5lY3Rpb25MaW1pdCIsInF1ZXVlTGltaXQiLCJwb29sIiwiY3JlYXRlUG9vbCIsInRlc3RDb25uZWN0aW9uIiwiY29ubmVjdGlvbiIsImdldENvbm5lY3Rpb24iLCJjb25zb2xlIiwibG9nIiwicmVsZWFzZSIsImVycm9yIiwicXVlcnkiLCJzcWwiLCJwYXJhbXMiLCJyZXN1bHRzIiwiZXhlY3V0ZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ }),

/***/ "(rsc)/./lib/upload.ts":
/*!***********************!*\
  !*** ./lib/upload.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   uploadFile: () => (/* binding */ uploadFile)\n/* harmony export */ });\n/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs/promises */ \"fs/promises\");\n/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs_promises__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nasync function uploadFile(file, folder) {\n    const bytes = await file.arrayBuffer();\n    const buffer = Buffer.from(bytes);\n    // Ensure directory exists\n    const uploadDir = (0,path__WEBPACK_IMPORTED_MODULE_1__.join)(process.cwd(), \"public\", \"uploads\", folder);\n    try {\n        await (0,fs_promises__WEBPACK_IMPORTED_MODULE_0__.mkdir)(uploadDir, {\n            recursive: true\n        });\n    } catch (error) {\n    // Ignore error if directory already exists\n    }\n    // Generate unique filename\n    const fileExtension = file.name.split('.').pop();\n    const filename = `${(0,crypto__WEBPACK_IMPORTED_MODULE_2__.randomUUID)()}.${fileExtension}`;\n    const filepath = (0,path__WEBPACK_IMPORTED_MODULE_1__.join)(uploadDir, filename);\n    // Write file\n    await (0,fs_promises__WEBPACK_IMPORTED_MODULE_0__.writeFile)(filepath, buffer);\n    return `/uploads/${folder}/${filename}`;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvdXBsb2FkLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBOEM7QUFDbkI7QUFDUTtBQUU1QixlQUFlSSxXQUFXQyxJQUFVLEVBQUVDLE1BQWM7SUFDdkQsTUFBTUMsUUFBUSxNQUFNRixLQUFLRyxXQUFXO0lBQ3BDLE1BQU1DLFNBQVNDLE9BQU9DLElBQUksQ0FBQ0o7SUFFM0IsMEJBQTBCO0lBQzFCLE1BQU1LLFlBQVlWLDBDQUFJQSxDQUFDVyxRQUFRQyxHQUFHLElBQUksVUFBVSxXQUFXUjtJQUMzRCxJQUFJO1FBQ0EsTUFBTUwsa0RBQUtBLENBQUNXLFdBQVc7WUFBRUcsV0FBVztRQUFLO0lBQzdDLEVBQUUsT0FBT0MsT0FBTztJQUNaLDJDQUEyQztJQUMvQztJQUVBLDJCQUEyQjtJQUMzQixNQUFNQyxnQkFBZ0JaLEtBQUthLElBQUksQ0FBQ0MsS0FBSyxDQUFDLEtBQUtDLEdBQUc7SUFDOUMsTUFBTUMsV0FBVyxHQUFHbEIsa0RBQVVBLEdBQUcsQ0FBQyxFQUFFYyxlQUFlO0lBQ25ELE1BQU1LLFdBQVdwQiwwQ0FBSUEsQ0FBQ1UsV0FBV1M7SUFFakMsYUFBYTtJQUNiLE1BQU1yQixzREFBU0EsQ0FBQ3NCLFVBQVViO0lBRTFCLE9BQU8sQ0FBQyxTQUFTLEVBQUVILE9BQU8sQ0FBQyxFQUFFZSxVQUFVO0FBQzNDIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXFBha3VtXFxEb3dubG9hZHNcXHp0b2ktc2Fsb24td2Vic2l0ZVxcbGliXFx1cGxvYWQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgd3JpdGVGaWxlLCBta2RpciB9IGZyb20gXCJmcy9wcm9taXNlc1wiXHJcbmltcG9ydCB7IGpvaW4gfSBmcm9tIFwicGF0aFwiXHJcbmltcG9ydCB7IHJhbmRvbVVVSUQgfSBmcm9tIFwiY3J5cHRvXCJcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGxvYWRGaWxlKGZpbGU6IEZpbGUsIGZvbGRlcjogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIGNvbnN0IGJ5dGVzID0gYXdhaXQgZmlsZS5hcnJheUJ1ZmZlcigpXHJcbiAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbShieXRlcylcclxuXHJcbiAgICAvLyBFbnN1cmUgZGlyZWN0b3J5IGV4aXN0c1xyXG4gICAgY29uc3QgdXBsb2FkRGlyID0gam9pbihwcm9jZXNzLmN3ZCgpLCBcInB1YmxpY1wiLCBcInVwbG9hZHNcIiwgZm9sZGVyKVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCBta2Rpcih1cGxvYWREaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIC8vIElnbm9yZSBlcnJvciBpZiBkaXJlY3RvcnkgYWxyZWFkeSBleGlzdHNcclxuICAgIH1cclxuXHJcbiAgICAvLyBHZW5lcmF0ZSB1bmlxdWUgZmlsZW5hbWVcclxuICAgIGNvbnN0IGZpbGVFeHRlbnNpb24gPSBmaWxlLm5hbWUuc3BsaXQoJy4nKS5wb3AoKVxyXG4gICAgY29uc3QgZmlsZW5hbWUgPSBgJHtyYW5kb21VVUlEKCl9LiR7ZmlsZUV4dGVuc2lvbn1gXHJcbiAgICBjb25zdCBmaWxlcGF0aCA9IGpvaW4odXBsb2FkRGlyLCBmaWxlbmFtZSlcclxuXHJcbiAgICAvLyBXcml0ZSBmaWxlXHJcbiAgICBhd2FpdCB3cml0ZUZpbGUoZmlsZXBhdGgsIGJ1ZmZlcilcclxuXHJcbiAgICByZXR1cm4gYC91cGxvYWRzLyR7Zm9sZGVyfS8ke2ZpbGVuYW1lfWBcclxufVxyXG4iXSwibmFtZXMiOlsid3JpdGVGaWxlIiwibWtkaXIiLCJqb2luIiwicmFuZG9tVVVJRCIsInVwbG9hZEZpbGUiLCJmaWxlIiwiZm9sZGVyIiwiYnl0ZXMiLCJhcnJheUJ1ZmZlciIsImJ1ZmZlciIsIkJ1ZmZlciIsImZyb20iLCJ1cGxvYWREaXIiLCJwcm9jZXNzIiwiY3dkIiwicmVjdXJzaXZlIiwiZXJyb3IiLCJmaWxlRXh0ZW5zaW9uIiwibmFtZSIsInNwbGl0IiwicG9wIiwiZmlsZW5hbWUiLCJmaWxlcGF0aCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/upload.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/mysql2@3.15.3/node_modules/mysql2/lib sync recursive ^cardinal.*$":
/*!*************************************************************************************!*\
  !*** ./node_modules/.pnpm/mysql2@3.15.3/node_modules/mysql2/lib/ sync ^cardinal.*$ ***!
  \*************************************************************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "(rsc)/./node_modules/.pnpm/mysql2@3.15.3/node_modules/mysql2/lib sync recursive ^cardinal.*$";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fservices%2Froute&page=%2Fapi%2Fadmin%2Fservices%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fservices%2Froute.ts&appDir=C%3A%5CUsers%5CPakum%5CDownloads%5Cztoi-salon-website%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CPakum%5CDownloads%5Cztoi-salon-website&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fservices%2Froute&page=%2Fapi%2Fadmin%2Fservices%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fservices%2Froute.ts&appDir=C%3A%5CUsers%5CPakum%5CDownloads%5Cztoi-salon-website%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CPakum%5CDownloads%5Cztoi-salon-website&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_Pakum_Downloads_ztoi_salon_website_app_api_admin_services_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/admin/services/route.ts */ \"(rsc)/./app/api/admin/services/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/admin/services/route\",\n        pathname: \"/api/admin/services\",\n        filename: \"route\",\n        bundlePath: \"app/api/admin/services/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\Pakum\\\\Downloads\\\\ztoi-salon-website\\\\app\\\\api\\\\admin\\\\services\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_Pakum_Downloads_ztoi_salon_website_app_api_admin_services_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vbmV4dEAxNS4yLjRfcmVhY3QtZG9tQDE5LjIuMF9yZWFjdEAxOS4yLjBfX3JlYWN0QDE5LjIuMC9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhZG1pbiUyRnNlcnZpY2VzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhZG1pbiUyRnNlcnZpY2VzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYWRtaW4lMkZzZXJ2aWNlcyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNQYWt1bSU1Q0Rvd25sb2FkcyU1Q3p0b2ktc2Fsb24td2Vic2l0ZSU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDUGFrdW0lNUNEb3dubG9hZHMlNUN6dG9pLXNhbG9uLXdlYnNpdGUmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ29DO0FBQ2pIO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxQYWt1bVxcXFxEb3dubG9hZHNcXFxcenRvaS1zYWxvbi13ZWJzaXRlXFxcXGFwcFxcXFxhcGlcXFxcYWRtaW5cXFxcc2VydmljZXNcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2FkbWluL3NlcnZpY2VzL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYWRtaW4vc2VydmljZXNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2FkbWluL3NlcnZpY2VzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcUGFrdW1cXFxcRG93bmxvYWRzXFxcXHp0b2ktc2Fsb24td2Vic2l0ZVxcXFxhcHBcXFxcYXBpXFxcXGFkbWluXFxcXHNlcnZpY2VzXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fservices%2Froute&page=%2Fapi%2Fadmin%2Fservices%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fservices%2Froute.ts&appDir=C%3A%5CUsers%5CPakum%5CDownloads%5Cztoi-salon-website%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CPakum%5CDownloads%5Cztoi-salon-website&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs/promises":
/*!******************************!*\
  !*** external "fs/promises" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "string_decoder":
/*!*********************************!*\
  !*** external "string_decoder" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ "timers":
/*!*************************!*\
  !*** external "timers" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("timers");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0","vendor-chunks/mysql2@3.15.3","vendor-chunks/aws-ssl-profiles@1.1.2","vendor-chunks/iconv-lite@0.7.0","vendor-chunks/long@5.3.2","vendor-chunks/lru-cache@7.18.3","vendor-chunks/denque@2.1.0","vendor-chunks/is-property@1.0.2","vendor-chunks/lru.min@1.1.3","vendor-chunks/sqlstring@2.3.3","vendor-chunks/seq-queue@0.0.5","vendor-chunks/named-placeholders@1.1.3","vendor-chunks/generate-function@2.3.1","vendor-chunks/safer-buffer@2.1.2","vendor-chunks/semver@7.7.3","vendor-chunks/jsonwebtoken@9.0.2","vendor-chunks/jws@3.2.2","vendor-chunks/ecdsa-sig-formatter@1.0.11","vendor-chunks/safe-buffer@5.2.1","vendor-chunks/ms@2.1.3","vendor-chunks/lodash.once@4.1.1","vendor-chunks/lodash.isstring@4.0.1","vendor-chunks/lodash.isplainobject@4.0.6","vendor-chunks/lodash.isnumber@3.0.3","vendor-chunks/lodash.isinteger@4.0.4","vendor-chunks/lodash.isboolean@3.0.3","vendor-chunks/lodash.includes@4.3.0","vendor-chunks/jwa@1.4.2","vendor-chunks/buffer-equal-constant-time@1.0.1"], () => (__webpack_exec__("(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fservices%2Froute&page=%2Fapi%2Fadmin%2Fservices%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fservices%2Froute.ts&appDir=C%3A%5CUsers%5CPakum%5CDownloads%5Cztoi-salon-website%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CPakum%5CDownloads%5Cztoi-salon-website&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();