export type IpcChannel =
  /*
   * The GET method requests a representation of the specified resource. Requests using GET should only retrieve data and should not contain a request content
   */
  "GET" |
  /*
   * The POST method submits an entity to the specified resource, often causing a change in state or side effects on the server.
   */
  "POST" |
  /**
   * The PUT method replaces all current representations of the target resource with the request content.
   */
  "PUT" |
  /*
   *
   */
  "PATCH" |
  /**
   * The DELETE method deletes the specified resource.
   */
  "DELETE";
