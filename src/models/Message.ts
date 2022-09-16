import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../db/config'

interface MessageAttributes {
  id: number
  jid: string
  message: string
  response: any
  status: string
}

/*
  We have to declare the MessageCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface MessageCreationAttributes extends Optional<MessageAttributes, 'id'> {}

interface MessageInstance
  extends Model<MessageAttributes, MessageCreationAttributes>,
    MessageAttributes {
  createdAt?: Date
  updatedAt?: Date
}

const Message = sequelize.define<MessageInstance>('messages', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  jid: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  message: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
  response: {
    allowNull: true,
    type: DataTypes.JSON,
    get() {
      return JSON.parse(this.getDataValue('response'))
    },
    set(value) {
      return this.setDataValue('response', JSON.stringify(value))
    },
  },
  status: {
    allowNull: true,
    type: DataTypes.STRING,
  },
})

;(async () => {
  await Message.sync({ alter: false })
})()

export default Message
