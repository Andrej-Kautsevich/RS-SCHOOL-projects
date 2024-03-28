export default class ApiModel {
  protected static async fetchAPI<T>(url: URL, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, options);
      let data;
      if (!response.ok) {
        data = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${data}`);
      }
      data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
