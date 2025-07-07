import './List.css'
import { useState } from 'react'
import ChangeBackground from './ChangeBackground'

// Biblioteca de importação de ícones
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faBan, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function List() {
    const [tarefa, setTarefa] = useState('')
    const [prioridade, setPrioridade] = useState('')
    const [data, setData] = useState('')
    const [lista, setLista] = useState([])
    const [limiteAtingido, setLimiteAtingido] = useState(false)
    const [modalAberto, setModalAberto] = useState(false)
    const [pesquisa, setPesquisa] = useState('')

    // Ordenação de tarefas por prioridade
    const tarefasOrdenadas = [...lista].sort((a, b) => {
        const ordemPrioridade = { alta: 1, intermediaria: 2, baixa: 3, 'não definida': 4 }
        return ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade]
    })

    const tarefasFiltradas = tarefasOrdenadas.filter((item) =>
        item.texto.toLowerCase().includes(pesquisa.toLowerCase()))

    const prioridades = ['alta', 'intermediaria', 'baixa', 'não definida']

    const tarefasAgrupadas = {
        'alta': tarefasOrdenadas.filter(tarefa => tarefa.prioridade === 'alta'),
        'intermediaria': tarefasOrdenadas.filter(tarefa => tarefa.prioridade === 'intermediaria'),
        'baixa': tarefasOrdenadas.filter(tarefa => tarefa.prioridade === 'baixa'),
        'não definida': tarefasOrdenadas.filter(tarefa => tarefa.prioridade === 'não definida')
    }

    function handleSubmit(e) {
        e.preventDefault()

        if (!tarefa.trim()) {
            return
        }

        const novaTarefa = {
            id: Math.floor(Math.random() * 10000),
            texto: tarefa,
            prioridade: prioridade || 'não definida',
            data: data || 'Sem data definida',
            status: false
        }

        if (lista.length < 20) {
            let index = lista.length
            for (let i = 0; i < lista.length; i++) {
                if (novaTarefa.prioridade === 'alta' && lista[i].prioridade !== 'alta') {
                    index = i
                    break
                } else if (novaTarefa.prioridade === 'intermediaria' &&
                          lista[i].prioridade !== 'alta' &&
                          lista[i].prioridade !== 'intermediaria') {
                    index = i
                    break
                } else if (novaTarefa.prioridade === 'baixa' &&
                          lista[i].prioridade === 'não definida') {
                    index = i
                    break
                }
            }

            const novaLista = [...lista]
            novaLista.splice(index, 0, novaTarefa)
            setLista(novaLista)
            setLimiteAtingido(false)
        } else {
            setLimiteAtingido(true)
        }

        setTarefa('')
        setPrioridade('')
        setData('')
    }

    function handleClear() {
        setLista([])
        setLimiteAtingido(false)
    }

    function handleToggle(id) {
        setLista(lista.map(item =>
            item.id === id ? { ...item, status: !item.status } : item
        ))
    }

    function handleClearUnique(id) {
        setLista(lista.filter(item => item.id !== id))
    }

    function handleClick() {
        setModalAberto(!modalAberto)
    }

    return (
        <>
            <h1>FocoList</h1>

        
            <ChangeBackground />

            <form onSubmit={handleSubmit}>
                <div className='input-add'>
                    <label>
                        <span className='titulos'>Nome da tarefa:</span>
                        <input
                            type="text"
                            onChange={(e) => setTarefa(e.target.value)}
                            value={tarefa}
                            placeholder="Ex: Estudar React"
                            required
                        />
                    </label>
                    <input className='btn btn-add' type="submit" value="Adicionar Tarefa" />
                </div>

                <div className='input-forms'>
                    <label>
                        <span className='titulos'>Prioridade da tarefa:</span>
                        <select
                            value={prioridade}
                            onChange={(e) => setPrioridade(e.target.value)}
                        >
                            <option value="">Selecione uma prioridade</option>
                            <option value="alta">Alta</option>
                            <option value="intermediaria">Intermediária</option>
                            <option value="baixa">Baixa</option>
                        </select>
                    </label>
                </div>

                <div className='input-forms'>
                    <label>
                        <span className='titulos'>Data da tarefa:</span>
                        <input
                            type="date"
                            onChange={(e) => setData(e.target.value)}
                            value={data}
                        />
                    </label>
                </div>

                {limiteAtingido && (
                    <div className="limite-mensagem">
                        Limite de 20 tarefas atingido! Limpe a lista para adicionar mais.
                    </div>
                )}
            </form>

            <div className="task-list">
                <h2>Pesquisar por Tarefas</h2>

                <input
                    type="text"
                    value={pesquisa}
                    placeholder="Ex: Arrumar a Casa"
                    onChange={(ev) => setPesquisa(ev.target.value)}
                />

                {pesquisa ? (
                    lista.length === 0 ? (
                        <p className="lista-vazia">Nenhuma tarefa adicionada ainda</p>
                    ) : tarefasFiltradas.length > 0 ? (
                        <ul>
                            {tarefasFiltradas.map((item) => (
                                <li key={item.id} className={`task-item priority-${item.prioridade}`}>
                                    <span>Nome da tarefa: {item.texto} </span><br />
                                    <span>Prioridade: {item.prioridade}</span><br />
                                    <span>Data: {item.data}</span><br />
                                    <button onClick={() => handleToggle(item.id)} className="icon-button icon-confirmar">
                                        <FontAwesomeIcon icon={item.status ? faBan : faCheckCircle} />
                                    </button>
                                    <button onClick={() => handleClearUnique(item.id)} className="icon-button icon-excluir">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="lista-vazia">Nenhuma tarefa encontrada</p>
                    )
                ) : null}
        
            </div>
            <input className='btn btn-limpar' type="button" value="Limpar tarefas" onClick={handleClear} />
            <input className='btn btn-listar' type="button" value="Ver todas as tarefas" onClick={handleClick} />

            {modalAberto && (
                <div className="modal">
                    <div className="modal-conteudo" style={{maxHeight: '400px', overflowY: 'auto'}}>
                        <span className="fechar" onClick={handleClick}>&times;</span>
                        <h2>Todas as Tarefas</h2>

                        {prioridades.map((prioridade) => {
                            const tarefas = tarefasAgrupadas[prioridade]
                            if (!tarefas || tarefas.length === 0) return null

                            return (
                                <div key={prioridade}>
                                    <h3>Prioridade: {prioridade}</h3>
                                    <ul>
                                        {tarefas.map((item) => (
                                            <li key={item.id} className={`task-item priority-${item.prioridade}`}>
                                                <span>Nome: {item.texto}</span><br />
                                                <span>Data: {item.data}</span><br />
                                                <span>Status: {item.status ? 'Concluída' : 'Pendente'}</span>

                                                <button onClick={() => handleToggle(item.id)} className=" icon-button icon-confirmar">
                                                    <FontAwesomeIcon icon={item.status ? faBan : faCheckCircle} />
                                                </button>

                                                <button onClick={() => handleClearUnique(item.id)} className=" icon-button icon-excluir">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    )
}
