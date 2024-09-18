import sentry_sdk

from ._env import env

sentry_sdk.init(
    dsn=env.str("SENTRY_DSN"),
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for tracing.
    traces_sample_rate=env.float("SENTRY_TRACE_SAMPLE_RATE", 1.0),
    # Set profiles_sample_rate to 1.0 to profile 100%
    # of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=env.float("SENTRY_PROFILE_SAMPLE_RATE", 1.0),
)
