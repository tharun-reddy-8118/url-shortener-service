class UserAlreadyExistsError(Exception):
    pass


class EmailAlreadyExistsError(Exception):
    pass


class InvalidCredentialsError(Exception):
    pass


class InvalidTokenError(Exception):
    pass


class URLNotFoundError(Exception):
    pass


class URLInactiveError(Exception):
    pass


class URLExpiredError(Exception):
    pass