import React, { Component } from 'react'
import Main from '../template/Main'
import axios from 'axios'

const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de Usuários'
}

const baseUrl = 'http://localhost:3001/users'
const inicialState = {
    user: { name: '', cpf: '', nascimento: '', cadastro: '', renda: ''},
    list: []
}


export default class UserCrud extends Component {

    state = { ...inicialState }

    clear() {
        this.setState({ user: inicialState.user})
    }

    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ user: inicialState.user, list })
            })
    }

    getUpdatedList(user) {
        const list = this.state.list.filter(u => u.id !== user.id)
        list.unshift(user)
        return list
    }

    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
    }

    getDate() {
        var today = new Date()
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0')
        var yyyy = String(today.getFullYear())

        today =  dd + '/' + mm + '/' + yyyy
        return today
    }45

    renderForm() {

       return (
           <div className="form">
               <div className="row">
                   <div className="col-12 col-md-6">
                       <div className="form-group">
                          <label>Nome</label>
                          <input type="text" className="form-control"
                           name="name"
                           maxLength="150"
                           value={this.state.user.name}
                           onChange={e => this.updateField(e)}
                           placeholder="Digite o nome" />
                       </div>
                   </div>

                   <div className="col-12 col-md-6">
                       <div className="form-group">
                          <label>CPF</label>
                          <input type="text" className="form-control"
                            maxLength="11"
                            name="cpf"
                            value={this.state.user.cpf}
                            onChange={e => this.updateField(e)}
                            placeholder="Digite o CPF" />
                       </div>
                   </div>
               </div>
               <div className="row">
                   <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Data de Nascimento</label>
                            <input type="date" className="form-control"
                                //max= {}
                                name="nascimento"
                                value={this.state.user.nascimento }
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a data de nascimento" />
                        </div>
                   </div>
                   <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Data do Cadastro</label>
                            <input type="text" className="form-control"
                                readOnly
                                name="cadastro"
                                value={this.state.user.cadastro = this.getDate()}
                                placeholder={this.getDate} />
                        </div>
                   </div>
               </div>
               <div className="row">
                   <div className="col-12 col-md-6">
                       <div className="form-group">
                           <label>Renda Familiar</label>
                           <input type="number" className="form-control"
                                step=".01"
                                min="0"
                                name="renda" 
                                value={this.state.user.renda}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a renda familiar" required />
                       </div>
                   </div>
               </div>
               <hr />
               <div className="row">
                   <div className="col-12 d-flex justify-content-end">
                       <button className="btn btn-primary"
                            onClick={ e=> this.save(e)}>
                            Salvar 
                       </button>

                        <button className="btn btn-secundary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar 
                        </button>
                   </div>
               </div>
           </div>
       ) 
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}  
            </Main>
        )
    }
}