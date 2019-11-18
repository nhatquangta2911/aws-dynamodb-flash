module.exports = {
  sortByDate: (a, b) => {
    if (a.createdAt > b.createdAt) {
      return -1;
    } else return 1;
  }
};
