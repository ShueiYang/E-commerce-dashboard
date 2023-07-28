
export function pluralize(label: string) {
  if(label === "Category") {
    return "categories"
  } else {
    return label.toLowerCase() + "s"
  }
}