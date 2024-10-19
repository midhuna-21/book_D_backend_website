"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rentBookValidation = (data) => {
    if (!data.bookTitle)
        return "Book title is required.";
    if (!data.description)
        return "Description is required.";
    if (!data.author)
        return "Author is required.";
    if (!data.publisher)
        return "Publisher is required.";
    if (!data.publishedYear)
        return "PublishedYear is required.";
    if (!data.genre)
        return "Genre is required.";
    if (data.rentalFee === undefined)
        return "Rental fee is required.";
    if (!data.images || data.images.length === 0)
        return "At least one image is required.";
    if (!data.extraFee === undefined)
        return "Extra fee is required.";
    if (!data.address?.street)
        return "Street is required";
    if (!data.address?.city)
        return "City is required";
    if (!data.address?.district)
        return "District is required";
    if (!data.address?.state)
        return "State is required";
    if (!data.address?.pincode)
        return "Pincode is required";
    if (!data.quantity)
        return "Quantity is required";
    if (!data.maxDistance)
        return "Maximum distance is required";
    if (!data.maxDays)
        return "Maximum days is required";
    if (!data.minDays)
        return "Minimum days is required";
    return null;
};
exports.default = rentBookValidation;
//# sourceMappingURL=rentBookValidation.js.map