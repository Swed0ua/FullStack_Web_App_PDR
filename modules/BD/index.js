const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

class Database {
    constructor(database, username, password) {
        this.sequelize = new Sequelize(database, username, password, {
            host: 'localhost',
            dialect: 'mysql'
        });
        this.User = this.defineUserModel();
        this.Curses = this.defineCoursesModel();
        this.Tests = this.definePDRTestsModel()
    }

    defineUserModel() {
        return this.sequelize.define('User', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            history: {
                type: DataTypes.JSON,
                defaultValue: []
            }
        });            
    }
    defineCoursesModel() {
        return this.sequelize.define('Courses', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            desc: {
                type: DataTypes.STRING,
                defaultValue: ''
            },
            descHTML: {
                type: DataTypes.TEXT,
                defaultValue: ''
            },
            links: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            path: {
                type: DataTypes.STRING,
                allowNull: false
            },
            mainPhoto: {
                type: DataTypes.STRING,
                allowNull: false // Шлях до основної фотографії
            },
            assessments: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: {}
            },
        });        
    }
    definePDRTestsModel() {
        return this.sequelize.define('PDRTests', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            // courseId: {
            //     type: DataTypes.INTEGER,
            //     allowNull: false, // Посилання на id курсу, до якого відноситься тест
            //     references: {
            //         model: 'Courses',
            //         key: 'id'
            //     }
            // },
            title: {
                type: DataTypes.STRING,
                allowNull: false 
            },
            img: {
                type: DataTypes.STRING,
                defaultValue: ''
            },
            description: {
                type: DataTypes.STRING,
                defaultValue: ''
            },
            questions: {
                type: DataTypes.JSON,
                allowNull: false, 
                defaultValue: []
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: false, 
                defaultValue: 0
            },
            instructions: {
                type: DataTypes.TEXT,
                defaultValue: '' 
            },
            passPercentage: {
                type: DataTypes.FLOAT,
                allowNull: false, 
                defaultValue: 0
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            link: {
                type: DataTypes.STRING,
                defaultValue: ''
            }
        });
    }
    async addCourse(title, desc, descHTML, link, path, mainPhoto) {
        try {
            const course = await this.Curses.create({
                title: title,
                desc: desc,
                descHTML: descHTML,
                link: link,
                path: path,
                mainPhoto: mainPhoto
            });
            console.log('Course added successfully:', course.toJSON());
            return course;
        } catch (error) {
            console.error('Error adding course:', error);
            throw error;
        }
    }

    async init() {
        try {
            await this.sequelize.sync();
            console.log('Database synchronized');
        } catch (error) {
            console.error('Database synchпшronization error:', error);
        }
    }

    async createUser(username, password, firstName, lastName) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await this.User.create({ username, password: hashedPassword, firstName, lastName});
            console.log('User created successfully');
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }
    async createTests(data) {
        try {
            await this.Tests.create({ ...data});
            console.log('Tests created successfully');
        } catch (error) {
            console.error('Error creating Tests:', error);
        }
    }

    async findUserByUsername(username) {
        try {
            return await this.User.findOne({ where: { username:username } });
        } catch (error) {
            console.error('Error finding user by username:', error);
            return null;
        }
    }

    async getTestsHistory(username) {
        try {
            const user = await this.User.findOne({ where: { username } });
            if (user) {
                return user.history;
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error('Error getting driving history:', error);
            return null;
        }
    }

    async addToTestsHistory(username, record) {
        try {
            const user = await this.User.findOne({ where: { username } });
            if (user) {
                user.history.push(record);
                await user.save();
                console.log('Record added to driving history');
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error('Error adding record to driving history:', error);
        }
    }
}

module.exports = Database;
