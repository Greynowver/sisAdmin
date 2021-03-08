import React, { Component } from 'react'
import Main from '../template/Main'
import axios from 'axios'
import CurrencyInput from 'react-currency-input'

const headerProps = {
    icon: 'list',
    title: 'Usuários',
    subtitle: 'Lista de Usuários'
}

const baseUrl = 'http://localhost:3001/users'
const inicialState = {
    user: { name: '', cpf: '', nascimento: '', cadastro: '', renda: ''},
    list: []
}

export default class UserList extends Component {

    state = { ...inicialState }

    componentWillMount(){
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    load(user) {
        this.setState({ user })
    }

    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if (add) list.unshift(user)
        return list
    }

    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
    }

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

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Renda</th>
                        <th>Acões</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.renda}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>    
            )
        })
    }

    render() {
        return(
            <Main {...headerProps}>
                {this.renderTable()}
                {this.renderForm()}
            </Main>
        )
    }

    renderBadge(user) {

    }

    setClass() {
        const userClass = this.state.user
        const rendaFormatada = userClass.renda.replace(/([^\d])+/gim, '')
        if(rendaFormatada <= 98000 || ''){
            this.state.user.classe = "A"
        }else if( rendaFormatada > 98000  &&  rendaFormatada <= 250000){
            this.state.user.classe = "B"
        }else if(rendaFormatada > 250000 ){
            this.state.user.classe = "C"
        }
    }

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
                           <label>Renda Familiar</label>
                           <CurrencyInput className="form-control"
                                prefix="R$ "
                                precision="2"
                                decimalSeparator="."
                                min="0"
                                name="renda" 
                                value={this.state.user.renda}
                                onChangeEvent={e => this.updateField(e)}
                                onBlur={e => this.setClass()}
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
}