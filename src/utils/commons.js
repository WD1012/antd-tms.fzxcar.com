export default function isEmpty (value) {
  return (Array.isArray(value) && value.length === 0)
    || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0)
}
