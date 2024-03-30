# 2.2.0
* Node.js 12
* mbedtls 2.27

# 2.1.0

* updating mbedtls submodule to 2.9.0

# 2.0.2

* Allow custom socket binding
* Remove test certs
* Increase max content size

# 2.0.1

* Fix usage of public key

# 2.0.0

* Remove public key argument

# 1.0.4

* Update mbedtls that plays nice with GCC

# 1.0.3

* Return `int` from `DtlsSocket::close` that indicates when a close alert will not be sent.

# 1.0.2

* Fix send callback handling to prevent deadlock

# 1.0.1

* Update mbedtls with queueing fixes

# 1.0.0

* Initial release