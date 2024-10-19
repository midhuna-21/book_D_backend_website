"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sellBookValidation = (bookSelldata) => {
    if (!bookSelldata.bookTitle)
        return "Book title is required.";
    if (!bookSelldata.description)
        return "Description is required.";
    if (!bookSelldata.author)
        return "Author is required.";
    if (!bookSelldata.publisher)
        return "Publisher is required.";
    if (!bookSelldata.publishedYear)
        return "publishedYear is required.";
    if (!bookSelldata.genre)
        return "Genre is required.";
    if (bookSelldata.price === undefined)
        return "Price is required.";
    if (!bookSelldata.images || bookSelldata.images.length === 0)
        return "At least one image is required.";
    if (!bookSelldata.address?.street)
        return "Street is required";
    if (!bookSelldata.address?.city)
        return "City is required";
    if (!bookSelldata.address?.district)
        return "District is required";
    if (!bookSelldata.address?.state)
        return "State is required";
    if (!bookSelldata.address?.pincode)
        return "Pincode is required";
    if (!bookSelldata.quantity)
        return "Quantity is required";
    if (!bookSelldata.maxDistance)
        return "Maximum distance is required";
    if (!bookSelldata.latitude)
        return "Location not getting";
    if (!bookSelldata.longitude)
        return "Location not getting";
    return null;
};
exports.default = sellBookValidation;
//# sourceMappingURL=sellBookValidation.js.map