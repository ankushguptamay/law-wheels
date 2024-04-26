function capitalizeFirstLetter(str) {
    const words = str.split(" ");

    return words.map((word) => {
        return word[0].toUpperCase() + word.substring(1);
    }).join(" ");
}
module.exports = { capitalizeFirstLetter: capitalizeFirstLetter };