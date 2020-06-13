import React from 'react'

import Card from '../../components/card'

import { Calendar } from "primereact/calendar";
import { withRouter } from 'react-router-dom'
import FormGroup from '../../components/form-group'
import * as messages from '../../components/toastr'
import NaoConformidadeService from '../../app/service/naoConformidadeService'
import { ptBr } from "../../app/service/dateConfig";

class CadastroNaoConformidade extends React.Component {

  state = {
    id: null,
    dataocorrencia: null,
    descricao: '',
    setor: '',
    causa: '',
    acaocorretiva: '',
    status: '',
    prazoconclusao: null,
    usuario: null,
    atualizando: false
  }

  constructor() {
    super();
    this.service = new NaoConformidadeService();
  }

  componentDidMount() {
    const params = this.props.match.params

    if (params.id) {
      this.service
        .obterPorId(params.id)
        .then(response => {
          this.setState({ ...response.data, atualizando: true })
        })
        .catch(erros => {
          messages.mensagemErro(erros.response.data)
        })
    }
  }

  submit = () => {

    const { dataocorrencia, descricao, setor, causa, acaocorretiva, prazoconclusao } = this.state;
    const documento = { dataocorrencia, descricao, setor, causa, acaocorretiva, prazoconclusao };

    try {
      this.service.validar(documento)
    } catch (erro) {
      const mensagens = erro.mensagens;
      mensagens.forEach(msg => messages.mensagemErro(msg));
      return false;
    }

    this.service
      .salvar(documento)
      .then(response => {
        this.props.history.push('/cadastro-naoconformidades')
        messages.mensagemSucesso('Não conformidade cadastrado com sucesso!')
      }).catch(error => {
        messages.mensagemErro(error.response.data)
      })
  }

  atualizar = () => {
    const { descricao, setor, acaocorretiva, usuario, status, id } = this.state;
    const documento = { descricao, setor, acaocorretiva, usuario, status, id };

    this.service
      .atualizar(documento)
      .then(response => {
        this.props.history.push("/consulta-naoconformidades");
        messages.mensagemSucesso("Não conformidade atualizada com sucesso!");
      })
      .catch(error => {
        messages.mensagemErro(error.response.data);
      });
  }

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({ [name]: value })
  }

  render() {

    return (
      <Card
        title={
          this.state.atualizando
            ? "Atualização de não conformidade"
            : "Cadastro de não conformidade"
        }
      >
        <div className="col-md-3">
          <FormGroup id="inputDataOcorrencia" label="Data da Ocorrência: *">
            <Calendar
              value={this.state.dataocorrencia}
              onChange={(e) => this.setState({ dataocorrencia: e.value })}
              showIcon={true}
              dateFormat="dd/mm/yy"
              locale={ptBr}
            />
          </FormGroup>
        </div>
        <div className="row">
          <div className="col-md-12">
            <FormGroup id="inputDescricao" label="Descrição: *">
              <input
                id="inputDescricao"
                type="text"
                className="form-control"
                name="descricao"
                value={this.state.descricao}
                onChange={this.handleChange}
              />
            </FormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <FormGroup id="inputSetor" label="Setor: *">
              <input
                id="inputSetor"
                type="text"
                className="form-control"
                name="setor"
                value={this.state.setor}
                onChange={this.handleChange}
              />
            </FormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <FormGroup id="inputCausa" label="Causa: *">
              <input
                id="inputCausa"
                type="text"
                className="form-control"
                name="causa"
                value={this.state.causa}
                onChange={this.handleChange}
              />
            </FormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <FormGroup id="inputAcaoCorretiva" label="Ação corretiva: *">
              <input
                id="inputAcaoCorretiva"
                type="text"
                className="form-control"
                name="acaocorretiva"
                value={this.state.acaocorretiva}
                onChange={this.handleChange}
              />
            </FormGroup>
          </div>
        </div>
        <div className="col-md-3">
          <FormGroup id="inputPrazoConclusao" label="Prazo Conclusão: *">
            <Calendar
              value={this.state.prazoconclusao}
              onChange={(e) => this.setState({ prazoconclusao: e.value })}
              showIcon={true}
              dateFormat="dd/mm/yy"
              locale={ptBr}
            />
          </FormGroup>
        </div>
        <div className="row">
          <div className="col-md-6">
            {this.state.atualizando ? (
              <button onClick={this.atualizar} className="btn btn-success">
                <i className="pi pi-refresh"></i> Atualizar
              </button>
            ) : (
              <button onClick={this.submit} className="btn btn-success">
                <i className="pi pi-save"></i> Salvar
              </button>
            )}
            <button
              onClick={(e) => this.props.history.push("/home")}
              className="btn btn-danger"
            >
              <i className="pi pi-times"></i> Cancelar
            </button>
          </div>
        </div>
      </Card>
    );
  }

}

export default withRouter(CadastroNaoConformidade);