# node-bits-password
This bit exposes the ability to add basic password encryption to node-bits-rest.

For any field with the type PASSWORD, this bit will do the following:

* Mask the field in response to a GET
* Encrypt the value on a POST
* Check if a new value is specified, and then encrypt it if so on a PUT. In order not to update, please don't specify a value or use the sentinal *****