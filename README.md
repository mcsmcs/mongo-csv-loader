# A general loader for MongoDB from CSVs.

### Usage
`node csv-loader.js path/to/your/data.csv model-name`

### Dependencies
* nodejs installed
* A working MongoDB server

### Setup
This is a general CSV loader for MongoDB.  The loader will perform an upsert - if the record does not exist   

1. npm install
2. Update `src/config/mongodb.js` with your MongoDB URL.
3. Create a CSV file with labeled headers.
4. Write a Mongoose Model with `parseCsvRecord` to convert the JSON input from your CSV to an object the Model can use to instantiate a model.  
   * This gives you a chance to use a more human friendly CSV (dates for example)
   * This also allows you to create a unique _id if desired (prevent duplicates)
5. Add your model to `models/Models.js` with the key capitalized
6. Run your import