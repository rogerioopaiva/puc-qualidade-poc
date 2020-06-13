import React from "react";
import * as messages from "../../components/toastr";

import Card from "../../components/card";
import { withRouter } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import planosAcaoService from "../../app/service/planosAcaoService";
import LocalSotrageService from "../../app/service/localstorageService";
import FormGroup from "../../components/form-group";
import PlanosAcaoTable from "./planosacaoTable";

class ConsultaPlanosAcao extends React.Component {
    state = {
        oque: '',
        porque: '',
        onde: '',
        quem: '',
        showConfirmDialog: false,
        planosacaoDeletar: {},
        planosacaos: [],
    };

    constructor() {
        super();
        this.service = new planosAcaoService();
    }

    buscar = () => {
        if (!this.state.oque) {
            messages.mensagemErro(
                "O preenchimento do campo o que é obrigatório."
            );
            return false;
        }
        const usuarioLogado = LocalSotrageService.obterItem("_usuario_logado");

        const planosacaoFiltro = {
            oque: this.state.oque,
            porque: this.state.porque,
            onde: this.state.onde,
            quem: this.state.quem,
            usuario: usuarioLogado.id,
        };

        this.service
            .consultar(planosacaoFiltro)
            .then((resposta) => {
                const lista = resposta.data;
                if (lista.length < 1) {
                    messages.mensagemAlerta("Nenhum resultado encontrado.");
                }
                this.setState({ planosacaos: lista });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    editar = (id) => {
        this.props.history.push(`/cadastro-planosacao/${id}`);
    };

    abrirConfirmacao = (planosacao) => {
        this.setState({ showConfirmDialog: true, planosacaoDeletar: planosacao });
    };

    cancelarDelecao = () => {
        this.setState({ showConfirmDialog: false, planosacaoDeletar: {} });
    };

    deletar = () => {
        this.service
            .deletar(this.state.planosacaoDeletar.id)
            .then((response) => {
                const planosacaos = this.state.planosacaos;
                const index = planosacaos.indexOf(this.state.planosacaoDeletar);
                planosacaos.splice(index, 1);
                this.setState({ planosacaos, showConfirmDialog: false });
                messages.mensagemSucesso("Plano de ação deletada com sucesso!");
            })
            .catch((error) => {
                messages.mensagemErro("Ocorreu um erro ao tentar deletar o plano de ação.");
            });
    };

    prepararFormularioCadastro = () => {
        this.props.history.push("/cadastro-planosacao");
    };

    alterarStatus = (planosacao, status) => {
        this.service.alterarStatus(planosacao.id, status).then((response) => {
            const planosacaos = this.state.planosacaos;
            const index = planosacaos.indexOf(planosacao);
            if (index !== -1) {
                planosacao["status"] = status;
                planosacao[index] = planosacao;
                this.setState({ planosacao });
            }
            messages.mensagemSucesso("Status atualizado com sucesso!");
        });
    };

    render() {

        const confirmDialogFooter = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.deletar} />
                <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    onClick={this.cancelarDelecao}
                    className="p-button-secondary"
                />
            </div>
        );

        return (
            <Card title="Consulta Plano Ação">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputOque" label="O que: *">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputoque"
                                    value={this.state.oque}
                                    onChange={(e) => this.setState({ oque: e.target.value })}
                                    placeholder="Digite o que aconteceu"
                                />
                            </FormGroup>

                            <FormGroup htmlFor="inputPorque" label="Porque: *">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputporque"
                                    value={this.state.porque}
                                    onChange={(e) => this.setState({ porque: e.target.value })}
                                    placeholder="Digite o porque"
                                />
                            </FormGroup>

                            <FormGroup htmlFor="inputOnde" label="Onde: *">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputonde"
                                    value={this.state.onde}
                                    onChange={(e) =>
                                        this.setState({ onde: e.target.value })
                                    }
                                    placeholder="Digite onde"
                                />
                            </FormGroup>

                            <FormGroup htmlFor="inputQuem" label="Quem: *">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputonde"
                                    value={this.state.quem}
                                    onChange={(e) =>
                                        this.setState({ quem: e.target.value })
                                    }
                                    placeholder="Digite quem"
                                />
                            </FormGroup>

                            <button
                                onClick={this.buscar}
                                type="button"
                                className="btn btn-success"
                            >
                                <i className="pi pi-search"></i> Buscar
              </button>
                            <button
                                onClick={this.prepararFormularioCadastro}
                                type="button"
                                className="btn btn-danger"
                            >
                                <i className="pi pi-plus"></i> Cadastrar
              </button>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <PlanosAcaoTable
                                planosacaos={this.state.planosacaos}
                                deleteAction={this.abrirConfirmacao}
                                editarAction={this.editar}
                                alterarStatus={this.alterarStatus}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <Dialog
                        header="Godfather I"
                        visible={this.state.showConfirmDialog}
                        style={{ width: "50vw" }}
                        footer={confirmDialogFooter}
                        modal={true}
                        onHide={() => this.setState({ showConfirmDialog: false })}
                    >
                        Confirma a exclusão deste plano de ação?
          </Dialog>
                </div>
            </Card>
        );
    }
}

export default withRouter(ConsultaPlanosAcao);