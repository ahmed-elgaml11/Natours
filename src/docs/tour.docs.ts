/**
 * @swagger
 * tags:
 *   name: Tours
 *   description: Everything about Tours
 */

/**
 * @swagger
 * /tours:
 *   get:
 *     summary: Get all tours
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: List of tours
 */

/**
 * @swagger
 * /tours:
 *   post:
 *     summary: Create a new tour (admin or lead-guide only)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourInput'
 *     responses:
 *       201:
 *         description: Tour created
 */

/**
 * @swagger
 * /tours/top-5-tours:
 *   get:
 *     summary: Get top 5 cheapest and highly rated tours
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: List of top 5 tours
 */

/**
 * @swagger
 * /tours/tour-stats:
 *   get:
 *     summary: Get tour statistics
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: Tour stats via aggregation
 */

/**
 * @swagger
 * /tours/monthly-plan/{year}:
 *   get:
 *     summary: Get monthly plan (admin, lead-guide, or guide only)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Monthly plan for the given year
 */

/**
 * @swagger
 * /tours/tours-within/{distance}/center/{latlng}/unit/{unit}:
 *   get:
 *     summary: Find tours within a certain distance
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: distance
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: latlng
 *         required: true
 *         description: Latitude and longitude in format lat,lng
 *         schema:
 *           type: string
 *       - in: path
 *         name: unit
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tours within the specified distance
 */

/**
 * @swagger
 * /tours/distances/{latlng}/unit/{unit}:
 *   get:
 *     summary: Get distances to all tours from a point
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: latlng
 *         required: true
 *         description: Latitude and longitude in format lat,lng
 *         schema:
 *           type: string
 *       - in: path
 *         name: unit
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Distance calculations
 */

/**
 * @swagger
 * /tours/my-tours:
 *   get:
 *     summary: Get tours booked by current user
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user-specific tours
 */

/**
 * @swagger
 * /tours/{id}:
 *   get:
 *     summary: Get a tour by ID
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour data
 */

/**
 * @swagger
 * /tours/{id}:
 *   patch:
 *     summary: Update a tour (admin or lead-guide only)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourInput'
 *     responses:
 *       200:
 *         description: Tour updated
 */

/**
 * @swagger
 * /tours/{id}:
 *   delete:
 *     summary: Delete a tour (admin or lead-guide only)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Tour deleted
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TourInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - duration
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         duration:
 *           type: number
 *         difficulty:
 *           type: string
 *         summary:
 *           type: string
 *         description:
 *           type: string
 *         imageCover:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 */
