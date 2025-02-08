import { FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { API } from "../../../services/apiClient";
import Loading from "../../../components/Loading";
import { ErrorResponse } from "../../../App";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Popup from "../../../components/Popup";
import './index.css';


interface ActionsOfUserProps {
    id: string,
    title: string,
    description: string,
    category: string,
    points: number,
    userId: string,
    createdAt: string,
    user: {
        id: string,
        name: string,
        email: string,
        points: number
    }
}

function Usuario() {
    const navigate = useNavigate();

    const { user, signOut } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [insertNew, setInsertNew] = useState(false);
    const [actionsOfUser, setActionsOfUser] = useState<ActionsOfUserProps[] | []>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPopupRemoveOpen, setIsPopupRemoveOpen] = useState(false);
    const [isPopupEditOpen, setIsPopupEditOpen] = useState(false);
    const [isPopupCreateOpen, setIsPopupCreateOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [idAction, setIdAction] = useState("");

    const [category] = useState({
        Reciclagem: "Reciclagem",
        Energia: "Energia",
        Agua: "Agua",
        Mobilidade: "Mobilidade"
    });

    const [selectedCategory, setSelectedCategory] = useState("");
    const [quantity, setQuantity] = useState<number>();

    useEffect(() => {

        const fectchActionsOfUser = async () => {

            setLoading(true);

            try {

                const response = await API.get('/actions/my');

                setActionsOfUser(response.data);

            } catch (error) {
                const err = error as ErrorResponse;

                if (err?.response?.data) {
                    toast.error(err.response.data.message);
                }
                else {
                    toast.error("Falha na conexão de rede.");
                }
            } finally {
                setLoading(false);
            }
        }

        fectchActionsOfUser();
    }, []);

    if (loading) {
        return (
            <div className="login-container">
                <Loading size={2} />
            </div>
        );
    }

    const handleRemove = async (idAction: string) => {
        try {

            if (!idAction) {
                toast.error("Forneça a ação.");
                return;
            }

            await API.delete('/actions/' + idAction);
            toast.success("Ação removida com sucesso!");
            navigate('/');

        } catch (error) {
            const err = error as ErrorResponse;

            if (err?.response?.data) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Falha na conexão de rede.");
            }
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();

        if (title === '' || description === '' || selectedCategory === '' || quantity === undefined) {

            toast.error("Preencha todos os campos!");
            return;
        }

        if (quantity === 0) {
            toast.error("Quantidade inválida!");
            return;
        }
        setLoading(true);

        try {
            if (isEdit) {
                //const categoryExist = await API.get("categorys/" + idAction);

                await API.put('/actions/' + idAction, {
                    title,
                    description,
                    category: selectedCategory,
                    quantity
                });

            } else {
                await API.post('/actions', {
                    title,
                    description,
                    category: selectedCategory,
                    quantity
                });
            }

            navigate('/');

        } catch (error) {
            const err = error as ErrorResponse;

            if (err?.response?.data) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Falha na conexão de rede.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (

        <>
            <div>
                <h1>Olá, {user?.name}</h1>

                <div className="">

                    <button
                        onClick={() => {
                            if (insertNew)
                                setInsertNew(false)
                            else {

                                setIsPopupCreateOpen(true);
                                setInsertNew(true);
                            }
                        }}
                        type="button"
                        style={{
                            background: !insertNew ? "blue" : "red",
                            color: "#FFF",
                            border: 'none',
                            padding: '10px',
                            fontSize: '12px',
                            borderRadius: '6px',
                            cursor: "pointer"
                        }}>

                        {insertNew ? "Cancelar" : "Criar nova ação"}

                    </button>

                    {insertNew && (

                        <form onSubmit={handleRegister} className="login-form">
                            <div className="">
                                <input
                                    type="text"
                                    placeholder="Título"
                                    className="login-input"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Descrição"
                                    className="login-input"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Quantidade "
                                    className="login-input"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    required
                                />
                                <select
                                    className="login-input"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)} // Agora funciona corretamente!
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {Object.entries(category).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="">
                                <p>{isEdit ? "Editar" : "Cadastrar"}</p>
                            </button>

                        </form>
                    )}
                </div>
                {isPopupCreateOpen}
                {loading ? <Loading size={1} /> :
                    actionsOfUser.length > 0 ? (
                        <table className="actions-table">
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Descrição</th>
                                    <th>Categoria</th>
                                    <th>Pontos</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {actionsOfUser.map((action, index) => (
                                    <tr key={index}>
                                        <td>{action.title}</td>
                                        <td>{action.description}</td>
                                        <td>{action.category}</td>
                                        <td>{action.points}</td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    //setInsertNew(true);
                                                    setIsEdit(true);
                                                    setIsPopupEditOpen(true);
                                                    setIdAction(action.id);
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button type="button"
                                                onClick={() => {
                                                    setIsPopupRemoveOpen(true);
                                                    setIdAction(action.id);
                                                }}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Você ainda não possui ações</p>
                    )
                }

                <div className="logout" onClick={signOut}>
                    <p>Sair</p>
                </div>
            </div >
            {isPopupRemoveOpen &&
                <Popup isOpen={isPopupRemoveOpen} onClose={() => setIsPopupRemoveOpen(false)}>
                    <>
                        <p>Tem certeza de que deseja eliminar essa ação?</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: "4px" }}>
                            <button onClick={() => handleRemove(idAction)}>Sim </button>
                            <button onClick={() => setIsPopupRemoveOpen(false)}>Não</button>
                        </div>
                    </>
                </Popup>
            }

            {isPopupEditOpen &&
                <Popup isOpen={isPopupEditOpen} onClose={() => setIsPopupEditOpen(false)}>
                    <form onSubmit={handleRegister} className="login-form">
                        <div className="">
                            <input
                                type="text"
                                placeholder="Título"
                                className="login-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Descrição"
                                className="login-input"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Quantidade "
                                className="login-input"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                required
                            />
                            <select
                                className="login-input"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)} // Agora funciona corretamente!
                            >
                                <option value="">Selecione uma categoria</option>
                                {Object.entries(category).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="">
                            <p>{isEdit ? "Editar" : "Cadastrar"}</p>
                        </button>

                    </form>
                </Popup>
            }

        </>

    )
}

export default Usuario;



