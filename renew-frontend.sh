cd public
rm -rf .front
git clone -b gh-pages https://github.com/DiscreteTom/CannonVsMosquito.git .front

ls  | grep -v test | while read f;do
echo "deleting $f"
rm -rf $f
done

mv ./.front/* ./
#rm -rf .front
