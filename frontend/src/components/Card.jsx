import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { DELETE_TRANSACTION } from "../graphql/mutations/transaction.mutation";

const categoryColorMap = {
  saving: "from-green-700 to-green-400",
  expense: "from-pink-800 to-pink-600",
  investment: "from-blue-700 to-blue-400",
};

const Card = ({ transaction, authUser }) => {
  let { category, amount, location, date, paymentType, description } =
    transaction;
  const cardClass = categoryColorMap[category];

  const [deleteTransaction, { loading }] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: ["GetTransactions", "GetTransactionStatistics"],
  });

  description = description[0]?.toUpperCase() + description.slice(1);
  category = category[0]?.toUpperCase() + category.slice(1);
  paymentType = paymentType[0]?.toUpperCase() + paymentType.slice(1);
  const formattedDate = formatDate(date);

  const handleDelete = async () => {
    try {
      await deleteTransaction({
        variables: { transactionId: transaction._id },
      });
      toast.success("Transação deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      toast.error(error.message);
    }
  };

  let categoryTranslate;
  if (category === "Saving") categoryTranslate = "Deposito";
  if (category === "Expense") categoryTranslate = "Despesa";
  if (category === "Investment") categoryTranslate = "Investimento";

  let paymentTypeTranslate;
  if (paymentType === "Card") paymentTypeTranslate = "Cartão";
  if (paymentType === "Cash") paymentTypeTranslate = "Dinheiro";

  return (
    <div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold text-white">{categoryTranslate}</h2>
          <div className="flex items-center gap-2">
            {!loading && (
              <FaTrash className={"cursor-pointer"} onClick={handleDelete} />
            )}
            {loading && (
              <div className="w-6 h-6 border-t-2 border-b-2 rounded-full animate-spin"></div>
            )}
            <Link to={`/transaction/${transaction._id}`}>
              <HiPencilAlt className="cursor-pointer" size={20} />
            </Link>
          </div>
        </div>
        <p className="text-white flex items-center gap-1">
          <BsCardText />
          Descrição: {description}
        </p>
        <p className="text-white flex items-center gap-1">
          <MdOutlinePayments />
          Tipo de Pagamento: {paymentTypeTranslate}
        </p>
        <p className="text-white flex items-center gap-1">
          <FaSackDollar />
          Valor: R$ {amount}
        </p>
        <p className="text-white flex items-center gap-1">
          <FaLocationDot />
          Local: {location || "Não informado"}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-xs text-black font-bold">{formattedDate}</p>
          <img
            src={authUser?.profilePicture}
            className="h-8 w-8 border rounded-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
export default Card;
