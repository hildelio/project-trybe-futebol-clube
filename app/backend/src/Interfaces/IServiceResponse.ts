export default interface ServiceResponse<T> {
  type: number,
  message: string,
  data: {
    token?: string,
    value: null | T | string
  }
}
