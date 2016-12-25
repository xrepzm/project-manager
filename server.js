require('shelljs/global')

const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({ port: 8080 })

// https://mostafa-samir.github.io/async-recursive-patterns-pt2/

wss.on('connection', ws => {
  ws.send(':connected:')

  ws.on('message', message => createProject(JSON.parse(message).projectname))

  createProject = projectName => {
    const rootuser = 'root'
    const rootpass = ''
    const param = require('change-case').paramCase(projectName)
    const pascal = require('change-case').pascalCase(projectName)
    const dbname = require('change-case').snakeCase(projectName)
    const dbuser = dbname
    const dbpass = 'DBpasS2017&'

    if (/^win/.test(process.platform)) {
      require('dns').resolve('google.com', error => {
        if (error) {
          console.log('No connection')
        } else {

          cd('..')
          ws.send('Creating directory...\n')

          mkdir(param)
          cd(`${param}/`)

          ws.send('Creating git flow...\n')

          a = exec('git flow init -fd', { async: true })
          a.stdout.on('data', data => ws.send(data))
          a.on('close', code => {
            if ( ! code) {
              if (which('laraveL')) {
                ws.send('Install Laravel...\n')

                b = exec('laravel new', { async: true })

                b.stdout.on('data', data => ws.send(data))
                b.on('close', code => {
                  if ( ! code) {
                    ws.send('Copying EditorConfig file...\n')

                    cp(`${__dirname}\\.editorconfig`, `../${param}`)

                    c = exec('echo *.lock >> .gitignore', { async: true })
                    c.on('close', code => {
                      if ( ! code) {
                        d = exec('echo /bower_components >> .gitignore', { async: true })
                        d.on('close', code => {
                          if ( ! code) {
                            ws.send('Setup application name...\n')

                            e = exec(`php artisan app:name ${pascal}`, { async: true })
                            e.stdout.on('data', data => ws.send(data))
                            e.on('close', code => {
                              if ( ! code) {
                                ws.send('Create symbolic link for uploads...\n')
                                ws.send(exec('php artisan storage:link').stdout)
                                ws.send('Setup applications environment variables...\n')

                                sed('-i', /(APP_URL=http:\/\/)localhost/, `\$1${param}.dev`,  '.env')
                                sed('-i', /(DB_DATABASE=)homestead/, `\$1${dbname}`, '.env')
                                sed('-i', /(DB_USERNAME=)homestead/, `\$1${dbuser}`, '.env')
                                sed('-i', /(DB_PASSWORD=)secret/, `\$1${dbpass}`, '.env')
                                exec(`echo ##${projectName} > readme.md`)

                                ws.send(`<a href="http:\/\/${param}.dev" target="_blank">${projectName}</a>`)

                                if (rootpass.trim()) {
                                  exec(`mysql -u${rootuser} -p${rootpass} -e "CREATE DATABASE \`${dbname}\` CHARACTER SET utf8 COLLATE utf8_general_ci;"`)
                                  exec(`mysql -u${rootuser} -p${rootpass} -e "CREATE DATABASE \`${dbname}_testing\` CHARACTER SET utf8 COLLATE utf8_general_ci;"`)
                                  exec(`mysql -u${rootuser} -p${rootpass} -e "CREATE USER \`${dbuser}\`@\`localhost\` IDENTIFIED BY '${dbpass}';"`)
                                  exec(`mysql -u${rootuser} -p${rootpass} -e "GRANT ALL PRIVILEGES ON \`${dbname}\`.* TO \`${dbuser}\`@\`localhost\`;"`)
                                  exec(`mysql -u${rootuser} -p${rootpass} -e "GRANT ALL PRIVILEGES ON \`${dbname}_testing\`.* TO \`${dbuser}\`@\`localhost\`;"`)
                                  exec(`mysql -u${rootuser} -p${rootpass} -e "FLUSH PRIVILEGES;"`)
                                } else {
                                  exec(`mysql -u${rootuser} -e "CREATE DATABASE \`${dbname}\` CHARACTER SET utf8 COLLATE utf8_general_ci;"`)
                                  exec(`mysql -u${rootuser} -e "CREATE DATABASE \`${dbname}_testing\` CHARACTER SET utf8 COLLATE utf8_general_ci;"`)
                                  exec(`mysql -u${rootuser} -e "CREATE USER \`${dbuser}\`@\`localhost\` IDENTIFIED BY '${dbpass}';"`)
                                  exec(`mysql -u${rootuser} -e "GRANT ALL PRIVILEGES ON \`${dbname}\`.* TO \`${dbuser}\`@\`localhost\`;"`)
                                  exec(`mysql -u${rootuser} -e "GRANT ALL PRIVILEGES ON \`${dbname}_testing\`.* TO \`${dbuser}\`@\`localhost\`;"`)
                                  exec(`mysql -u${rootuser} -e "FLUSH PRIVILEGES;"`)
                                }

                                ws.send('\nCommiting repositiory...\n')
                                exec('git add .')
                                exec('git commit -m "Laravel installed"')
                                ws.send('Done!\n')

                                if (which('subl')) {
                                  exec('subl .')
                                }

                                ws.send('\nReload laragon...\n')

                                setTimeout(() => exec('..\\..\\laragon reload'), 5000)
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            }
          })
        }
      })
    }
  }
})
