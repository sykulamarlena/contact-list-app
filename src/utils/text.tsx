export const getInitials = (text: string) => {
  const names = text.split(" ");
  //get the first name and the first letter:
  let initials = names[0].substring(0, 1).toUpperCase();
  //if there are more then one name, takes the first letter of the last name (the one in position names.length - 1):
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};