import React, { Component } from 'react'
import Main from '../template/Main'
import axios from 'axios'
import CurrencyInput from 'react-currency-input'

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

    componentWillMount(){
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
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

    getCPF() {
        var newCPF = document.getElementById('cpf1').value
        const listCPF = this.state.list
        for(var i=0; i<listCPF.length; i++){
            if(listCPF[i].cpf === newCPF){
                alert("CPF já cadastrado")
                return
            }
        }

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
    }

    validarNome() {
        var strCpf = document.getElementById('cpf1').value
        if (!this.verificarCPF(strCpf)) {
            alert("CPF inválido")
            return
        }
        document.getElementById('frm')
    }

    verificarCPF(strCpf) {
        if (!/[0-9]{11}/.test(strCpf)) return false
        if (strCpf === "00000000000") return false
    
        var soma = 0
    
        for (var i = 1; i <= 9; i++) {
            soma += parseInt(strCpf.substring(i - 1, i)) * (11 - i)
        }
    
        var resto = soma % 11
    
        if (resto === 10 || resto === 11 || resto < 2) {
            resto = 0
        } else {
            resto = 11 - resto
        }
    
        if (resto !== parseInt(strCpf.substring(9, 10))) {
            return false
        }
    
        soma = 0
    
        for (var i = 1; i <= 10; i++) {
            soma += parseInt(strCpf.substring(i - 1, i)) * (12 - i);
        }
        resto = soma % 11
    
        if (resto === 10 || resto === 11 || resto < 2) {
            resto = 0
        } else {
            resto = 11 - resto
        }
    
        if (resto !== parseInt(strCpf.substring(10, 11))) {
            return false
        }
    
        return true
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
                          <label>CPF</label>
                          <input type="text" className="form-control"
                            id="cpf1"
                            maxLength="11"
                            name="cpf"
                            value={this.state.user.cpf}
                            onChange={e => this.updateField(e)}
                            onBlur={e => this.validarNome(e),
                               e => this.getCPF()}
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
                           <CurrencyInput className="form-control"
                                prefix="R$ "
                                precision="2"
                                decimalSeparator="."
                                min="0"
                                name="renda" 
                                value={this.state.user.renda}
                                onChangeEvent={e => this.updateField(e)}
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