#ifndef MBEDTLS_CONFIG_H
#define MBEDTLS_CONFIG_H

#if defined(_MSC_VER) && !defined(_CRT_SECURE_NO_DEPRECATE)
#define _CRT_SECURE_NO_DEPRECATE 1
#endif

#define MBEDTLS_SSL_SRV_C
#define MBEDTLS_SSL_CLI_C

#define MBEDTLS_PSK_MAX_LEN    16

#define MBEDTLS_HAVE_ASM
#define MBEDTLS_HAVE_TIME
#define MBEDTLS_HAVE_TIME_DATE
#define MBEDTLS_DEPRECATED_REMOVED

#define MBEDTLS_X509_CRT_PARSE_C
#define MBEDTLS_RSA_C
#define MBEDTLS_CERTS_C
#define MBEDTLS_PKCS1_V15

/* Symmetric cipher block modes. */
#define MBEDTLS_CIPHER_MODE_CBC
#define MBEDTLS_CIPHER_MODE_CFB
#define MBEDTLS_CIPHER_MODE_CTR

#define MBEDTLS_SSL_PROTO_TLS1_2
#define MBEDTLS_SSL_RAW_PUBLIC_KEY_SUPPORT

/* RSA */
#define MBEDTLS_RSA_C
#define MBEDTLS_DHM_C
#define MBEDTLS_PKCS1_V15
#define MBEDTLS_X509_CRT_PARSE_C
#define MBEDTLS_KEY_EXCHANGE_RSA_ENABLED

#define MBEDTLS_SSL_AEAD_RANDOM_IV

#define MBEDTLS_ECDSA_DETERMINISTIC
#define MBEDTLS_KEY_EXCHANGE_PSK_ENABLED

#define MBEDTLS_SSL_ENCRYPT_THEN_MAC
#define MBEDTLS_SSL_EXTENDED_MASTER_SECRET
#define MBEDTLS_SSL_FALLBACK_SCSV
#define MBEDTLS_SSL_RENEGOTIATION
#define MBEDTLS_SSL_SRV_RESPECT_CLIENT_PREFERENCE
#define MBEDTLS_SSL_MAX_FRAGMENT_LENGTH

#define MBEDTLS_SSL_ALPN

/* DTLS modules */
#define MBEDTLS_SSL_PROTO_DTLS
#define MBEDTLS_SSL_DTLS_ANTI_REPLAY
#define MBEDTLS_SSL_DTLS_HELLO_VERIFY
#define MBEDTLS_SSL_DTLS_CLIENT_PORT_REUSE
#define MBEDTLS_SSL_DTLS_BADMAC_LIMIT
#define MBEDTLS_SSL_DTLS_HANDSHAKE_QUEUE

#define MBEDTLS_SSL_EXPORT_KEYS
#define MBEDTLS_SSL_SERVER_NAME_INDICATION
#define MBEDTLS_SSL_TRUNCATED_HMAC

#define MBEDTLS_VERSION_FEATURES

#define MBEDTLS_X509_CHECK_KEY_USAGE
#define MBEDTLS_X509_CHECK_EXTENDED_KEY_USAGE

/* mbed TLS modules */
#define MBEDTLS_GENPRIME
#define MBEDTLS_AESNI_C
#define MBEDTLS_AES_C
#define MBEDTLS_ASN1_PARSE_C
#define MBEDTLS_ASN1_WRITE_C
#define MBEDTLS_BASE64_C
#define MBEDTLS_BIGNUM_C
#define MBEDTLS_BLOWFISH_C
#define MBEDTLS_CAMELLIA_C
#define MBEDTLS_CCM_C
#define MBEDTLS_CERTS_C
#define MBEDTLS_CIPHER_C
#define MBEDTLS_CTR_DRBG_C
#define MBEDTLS_ENTROPY_C
#define MBEDTLS_GCM_C
#define MBEDTLS_HMAC_DRBG_C
#define MBEDTLS_MD_C
#define MBEDTLS_MD5_C
#define MBEDTLS_OID_C
#define MBEDTLS_PEM_PARSE_C
#define MBEDTLS_PEM_WRITE_C
#define MBEDTLS_PK_C
#define MBEDTLS_PK_PARSE_C
#define MBEDTLS_PK_WRITE_C

#define MBEDTLS_PLATFORM_C

#define MBEDTLS_RIPEMD160_C
#define MBEDTLS_SHA1_C
#define MBEDTLS_SHA256_C

#define MBEDTLS_SSL_COOKIE_C

#define MBEDTLS_SSL_TLS_C
#define MBEDTLS_TIMING_C
#define MBEDTLS_VERSION_C

#define MBEDTLS_X509_USE_C
#define MBEDTLS_X509_CRT_PARSE_C
#define MBEDTLS_X509_CRL_PARSE_C

#define MBEDTLS_XTEA_C

#define MBEDTLS_SSL_DEBUG_ALL
#define MBEDTLS_DEBUG_C

#define MBEDTLS_ERROR_C  //Linker errors without

/* Save RAM at the expense of ROM */
#define MBEDTLS_AES_ROM_TABLES
#define MBEDTLS_SSL_KEEP_PEER_CERTIFICATE // evo Mbed TLS 2.26.0

/*
 * Save RAM at the expense of interoperability: do this only if you control
 * both ends of the connection!  (See comments in "mbedtls/ssl.h".)
 * The optimal size here depends on the typical size of records.
 */
#define MBEDTLS_SSL_MAX_CONTENT_LEN             1500
#define MBEDTLS_SSL_IN_CONTENT_LEN              1500
#define MBEDTLS_SSL_OUT_CONTENT_LEN              1373 // evo - TBD: prior was 1387... why?

#include "mbedtls/check_config.h"

#endif /* MBEDTLS_CONFIG_H */
