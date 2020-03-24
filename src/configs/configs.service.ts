import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as Joi from '@hapi/joi'


export interface EnvConfig {
  [key: string]: string
}

export class ConfigsService {
  private readonly envConfig: EnvConfig

  constructor() {
    let configFilePath = ''
    if (process.env.NODE_ENV && process.env.NODE_ENV === 'production' ) {
      configFilePath = '.production.env'
    }

    if (process.env.NODE_ENV && process.env.NODE_ENV === 'development' ) {
      configFilePath = '.development.env'
    }

    if (!process.env.NODE_ENV ) {
      configFilePath = '.local.env'
    }

    const config = dotenv.parse(fs.readFileSync(configFilePath))
    config.NODE_ENV = process.env.NODE_ENV || 'local'
    console.log('Node env', process.env.NODE_ENV)
    this.envConfig = this.validateInput(config)
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'local')
        .default('development'),
      HOST: Joi.string().required(),
      PORT: Joi.number().required(),
      DB_CONNECTION: Joi.string().required(),
      DB_HOST: Joi.string().required(),
      DB_USERNAME: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      DB_NAME: Joi.string().required(),
      DB_PORT: Joi.number().required(),
      SALT_ROUND: Joi.number().required(),
      JWT_SECRET: Joi.string().required(),
      FIREBASE_SERVICE_ACCOUNT_PATH: Joi.string().required(),
      FIREBASE_STORAGE_BUCKET: Joi.string().required()
    })

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig
    )

    if (error) {
      throw new Error(`Config validation error: ${error.message}`)
    }

    return validatedEnvConfig
  }

  get nodeEnv(): string {
    return String(this.envConfig.NODE_ENV)
  }

  get host(): string {
    return String(this.envConfig.HOST)
  }

  get port(): number {
    return Number(this.envConfig.PORT)
  }

  get databaseConfig(): object {
    return {
      dialect: String(this.envConfig.DB_CONNECTION),
      host: String(this.envConfig.DB_HOST),
      port: Number(this.envConfig.DB_PORT),
      username: String(this.envConfig.DB_USERNAME),
      password: String(this.envConfig.DB_PASSWORD),
      database: String(this.envConfig.DB_NAME),
    }
  }

  get saltRound(): number {
    return Number(this.envConfig.SALT_ROUND)
  }

  get JWTSecret(): string {
    return String(this.envConfig.JWT_SECRET)
  }

  get firebaseServiceAccountPath(): string {
    return String(this.envConfig.FIREBASE_SERVICE_ACCOUNT_PATH)
  }

  get firebaseStorageBucket(): string {
    return String(this.envConfig.FIREBASE_STORAGE_BUCKET)
  }
}
