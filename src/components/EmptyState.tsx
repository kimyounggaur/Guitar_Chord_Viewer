type Props = {
  message?: string;
};

export default function EmptyState({ message = '검색 결과가 없습니다.' }: Props) {
  return (
    <div className="mx-auto my-12 max-w-md rounded-[8px] border border-rose-100 bg-white px-6 py-8 text-center font-semibold text-stone-500 shadow-neumorphic">
      {message}
    </div>
  );
}
