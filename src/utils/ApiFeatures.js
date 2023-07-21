const ErrorResponse = require("./ErrorResponse");

class APIFeatures {
  constructor(query, queryString, entityType, allowedFields, refEntityType) {
    this.query = query;
    this.queryString = queryString;
    this.entityType = entityType;
    this.allowedFields = allowedFields;
    this.refEntityType = refEntityType;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excluedexcludedFields = ["page", "sort", "limit", "fields"];
    excluedexcludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query.find(JSON.parse(queryStr));

    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      const nonRefFields = fields
        .split(" ")
        .filter((field) => {
          const [entityType, f] = field.split(".");
          if (!Object.keys(this.allowedFields).includes(entityType)) {
            throw new ErrorResponse(
              `Invalid entity type ${entityType}`,
              400,
              field
            );
          } else if (
            entityType === this.entityType &&
            this.allowedFields[entityType].includes(f)
          ) {
            return f;
          } else if (
            entityType === this.entityType &&
            !this.allowedFields[entityType].includes(f)
          ) {
            throw new ErrorResponse(
              `Invalid field ${f} for ${entityType}`,
              400,
              field
            );
          }
        })
        .map((field) => field.split(".")[1]);

      const refFields = fields.split(" ").filter((field) => {
        const [entityType, f] = field.split(".");
        if (entityType !== this.entityType) {
          if (
            this.allowedFields[entityType] &&
            !this.allowedFields[entityType].includes(f)
          ) {
            throw new ErrorResponse(
              `Invalid field ${f} for ${entityType}`,
              400,
              field
            );
          }
          return f;
        }
      });
      console.log(refFields);
      const refFieldObj = refFields.reduce((acc, field) => {
        const [parent, child] = field.split(".");
        if (child === "password") {
          return acc;
        }
        if (!acc[parent]) {
          acc[parent] = child;
        } else {
          acc[parent] += ` ${child}`;
        }
        return acc;
      }, {});
      console.log(refFieldObj);

      const refPopulateOptions = Object.entries(refFieldObj).map(([k, v]) => ({
        path: k,
        select: this.allowedFields[k]
          ? this.allowedFields[k].filter((field) => v.includes(field)).join(" ")
          : "",
      }));
      console.log(refPopulateOptions);
      this.query = this.query
        .select(nonRefFields.join(" "))
        .populate(refPopulateOptions);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
